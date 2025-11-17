const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);
const reviewRouter = require(`${__dirname}/routes/reviewRoutes`);
const bookingRouter = require(`${__dirname}/routes/bookingRoutes`);
const viewRouter = require(`${__dirname}/routes/viewRoutes`);
const AppError = require(`${__dirname}/utils/appError`); // Global Error class
const globalErrorHandler = require(`${__dirname}/controllers/errorController`);

// Start express app
const app = express();

// Tell Express it’s behind a proxy
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES:

// Implement CORS
app.use(cors());// this is for simple requests like get/post
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options('*', cors());// this is for non simple request like put/patch/delete/cookies
// app.options('/api/v1/tours/:id', cors());

app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      scriptSrc: [
        "'self'",
        'https://api.mapbox.com',          // allow Mapbox JS
        'https://cdnjs.cloudflare.com',    // optional, for any other CDNs
        'https://js.stripe.com',           // Jonas also uses Stripe
        'blob:'
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",                 // inline styles
        'https://api.mapbox.com',          // allow Mapbox CSS
        'https://fonts.googleapis.com'
      ],
      imgSrc: [
        "'self'",
        'data:',
        'blob:',
        'https://api.mapbox.com'           // allow Mapbox images
      ],
      connectSrc: [
        "'self'",
        'https://api.mapbox.com',          // allow Mapbox requests
        'https://events.mapbox.com',
        'https://cdnjs.cloudflare.com',
        'ws:',                  // allow WebSocket connections (for Parcel)
        'http://127.0.0.1:*',   // allow localhost connections
        'http://localhost:*'
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      frameSrc: ["'self'", 'https://js.stripe.com'], // Stripe checkout loads in iframe
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // limiting the amount of data to 10kb that comes in the body. it will not accept a body >10kb

// url encoded for getting the url
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// cookie parser middleware
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
})

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => { // app.all means for all get, post, put, patch, delete. '*' means all the routes
  next(new AppError(`Can't find ${req.originalUrl} on this server!!`, 404));
})


// Global Error Handler Middleware:
app.use(globalErrorHandler);

module.exports = app;