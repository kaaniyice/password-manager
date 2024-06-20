const express = require('express')
const path = require('path');
const session = require('express-session');
require('./config/db')
require('dotenv').config()
const auth = require('./middleware/auth');

const app = express();

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // secure: true if using HTTPS
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const routes = require('./routes/index')
// /users
app.use(routes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));