const mongoose = require('mongoose');

//TO ACCESS ENVIRONMENT VARIABLES
const dotenv = require('dotenv');
dotenv.config({ path: "./configs/config.env" });

const URI = process.env.MONGO_URI;

const connectDB = () => {
    mongoose.connect(URI,  { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then( (result) => console.log("DataBase Connected"))
        .catch( (error) => console.log(error));
}

module.exports = connectDB;