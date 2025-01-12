const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDb = async () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`Database connected successfully`.bgCyan.white))
    .catch((error) => {
        console.log("Issue in DB connection");
        console.error(`${error}`.bgRed);
        process.exit(1);
    });
};

module.exports = connectDb;