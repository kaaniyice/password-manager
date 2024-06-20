const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => console.log('MongoDB connection failure: ', err));

const db = mongoose.connection

module.exports = db