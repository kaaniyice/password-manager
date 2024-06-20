const User = require('../models/user');
const bcrypt = require('bcryptjs');
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const userController = {

    register: async (req, res) => {
        error = ""
        const { username, email, password, rePassword } = req.body;
        
        // Check if all the fields are filled
        if (!username || !email || !password || !rePassword)
            error= "Please Fill All fields" 
        // Check the passwords match
        if (password !== rePassword)
            error= "Passwords do not match."
        // Check is email valid
        if(!email.match(emailRegex))
            error = "Please enter a real email address"
        // handle user type errors
        if(error){
            return res.render('register', {
                username : username,
                email : email,
                error: error,
            })
        }

        try {
            // check if the user already exist
            let user = await User.findOne({ email });
            if (user) {
                return res.render('register', { error: 'User already exists' });
            }
    
            // if not create new user
            user = new User({
                username,
                email,
                password,
            });
    
            // hash the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
    
            // save the user
            await user.save();
            // redirect to login page
            res.redirect('/users/login');
            // handle errors
        } catch (err) {
            console.error(err.message);
            res.render('register', { 
                username,
                email,
                error: 'Server error' 
            });
        }
    },

    registerPage : (req, res) => {
        if (!req.session.user){
            const error = req.query.error || null;
            const username = req.query.username || null;
            const email = req.query.email || null;
            return res.render('register', {
                username: username,
                email: email,
                error: error
            })
        }
        res.redirect('/');
    },
    
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            let user = null;
            if(email.match(emailRegex)){
                user = await User.findOne({ email: email });
            } 
            else{
                user = await User.findOne({ username: email });
            }
            
            if (!user) {
                return res.render('login', { error: 'There is no registered user with this email/username.' });
            }
            const PassMatch = await bcrypt.compare( password, user.password);

            if(!PassMatch)
                return res.render('login', { error: 'Invalid credentials' });
            
            // if password's match with the chosen email in database succes
            req.session.user = user;
            res.redirect('/');

        } catch (err){
            console.log(err)
            return res.render('login', { error: 'server error' });
        } 
    },

    loginPage : (req, res) => {
        if (!req.session.user){
            const error = req.query.error || null;
            return res.render('login', { error })
        }
        res.redirect('/');
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if(err)
                return res.redirect('/');
        })
        res.redirect('/users/login')
    },
}

module.exports = userController