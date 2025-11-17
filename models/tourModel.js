const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'A tour must have a name'],
        maxLength: [40, 'A tour name must be less or equal than 40 characters'],
        minLength: [10, 'A tour name must be greater or equal than 10 characters'],
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty can be either: easy, medium, or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val*10)/10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
                return val < this.price
            },
            message: 'Discount price ({VALUE}) should be below the regular price'
        }
    },
    summary: {
        type: String,
        required: [true, 'A tour must have a summary'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
    startLocation: {
      // GeoJSON is the datatpye in mongodb in order to specify geospecial data.
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number], // [latitude, longitude]
      address: String,
      description: String
    },
    locations: [ // this is embedded document and it must contain an array of objects
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// VIRTUAL PROPERTIES:
tourSchema.virtual('durationWeeks').get(function(){ // don't use arrow function bcoz arrow fnx doesn't have this keyword.
    return this.duration/7;
})

// Virtual Populate:
tourSchema.virtual('reviews', {
    ref: 'Review', // reference of the model we want
    foreignField: 'tour', // jahan par dalna hai
    localField: '_id' // current model se kya dalna hai
});


// MIDDLEWARES:

tourSchema.pre('save', function(next){
    // console.log(this); // 'this' points to the current document.
    this.slug = slugify(this.name, { lower: true });
    next();
})

tourSchema.post('save', function(doc, next){
    // console.log(doc);
    next();
})

// QUERY MIDDLEWARE:
tourSchema.pre(/^find/, function(next){
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
})

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });

    next();
});

// tourSchema.post(/^find/, function(docs, next){
//     // console.log(docs);
//     console.log(`Query took ${Date.now() - this.start} milliseconds`);
//     next();
// })


// AGGREGATE MIDDLEWARE:
tourSchema.pre('aggregate', function(next){

    const pipeline = this.pipeline();
    if (pipeline[0]?.['$match']) {
        this.pipeline().unshift({ $match: { secretTour: { $ne: true} } });
    }
    next();
})

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;