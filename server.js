const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/config.env`});

const Tour = require(`${__dirname}/models/tourModel`)

const DB = process.env.DATABASE.replace("<db_password>", process.env.DB_PASSWORD);

// connect to DB using mongoose:
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(con => {
    // console.log(con.connections);
    console.log("DB connection successful");
})

const app = require(`${__dirname}/app`);

const port = process.env.PORT || 8000;
// creating a server using express
const server = app.listen(port, function(){
    console.log(`App running on port ${port}...`);
})

// Unhandled Promise Rejection:
process.on('unhandledRejection', err => {
    console.log("Unhandled Rejection. Shutting Down...");
    console.log(err.name, err.message);
    server.close(()=>{
        process.exit(1);
    })
})

// Uncaught Exception:
process.on('uncaughtException', err => {
    console.log("Uncaught Exception. Shutting Down...");
    console.log(err.name, err.message);
    process.exit(1);
})