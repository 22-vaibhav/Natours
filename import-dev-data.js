// This script is only to import and delete data from ./dev-data/data/tours-simple.json to mongodb

const fs = require('fs');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/config.env`});

const DB = process.env.DATABASE

const Tour = require('./models/tourModel');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => {
    console.log("DB connection successful");
})

// Read JSON file:
const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours.json", 'utf-8'));
const users = JSON.parse(fs.readFileSync("./dev-data/data/users.json", 'utf-8'));
const reviews = JSON.parse(fs.readFileSync("./dev-data/data/reviews.json", 'utf-8'));

// Import data into mongodb:
const importData = async () => {
    try{
        await Tour.create(tours); // .create() can accept a single object or an array of objects.
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log("Data successfully loaded!!");
    }
    catch(err){
        console.log(err);
    }
    process.exit();
}

// Delete all data from DB:
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data successfully deleted!!");
    }
    catch(err){
        console.log(err);
    }
    process.exit();
}

// console.log(process.argv);
// COMMAND: node import-dev-data.js --import, then process.argv will give me an array of values and the 3rd value contains this '--import' as a string value. So we will use it to call the function inside through command line and not just calling the function inside the js file.

if(process.argv[2] === "--import") importData();
if(process.argv[2] === "--delete") deleteData();