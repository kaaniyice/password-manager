const Password = require('../models/password');
const { encrypt, decrypt } = require('../utils/encryption');

const passwordController = {

    addPasword: async (req, res) => {
        const { title, username ,password } = req.body

        try {
            const encryptedPassword = encrypt(password);

            const newPassword = new Password({
                userId: req.session.user._id,
                title,
                username,
                password: encryptedPassword
            });

            await newPassword.save();

            res.redirect('/passwords');

        } catch (err) {
            console.log(err)
            res.status(500).redirect('/passwords');
        }

    },
    addPasswordPage: (req, res) => {
        const error = req.query.error || null;
        res.render('addPassword', { error });
    },
    getPassword: async (req, res) => {
        try {   
            const error = req.query.error || null;
            const passwords = await Password.find({ userId: req.session.user._id });
            const decryptedPasswords = passwords.map(pw => ({
            ...pw._doc,
            password: decrypt(pw.password)
        }));

            res.render('passwords', { passwords: decryptedPasswords, error: error})
        } catch (err) {
            console.log(err)
            res.status(500).render('error', { message: 'Server error' });
        }
    },
    deletePassword: async (req, res) => {
        try {
            const { id } = req.params;

            const password = await Password.findById(id)

            // if the user requested the delete is the one that created it
            if(password.userId.toString() === req.session.user._id)
                {
                    await Password.findOneAndDelete(id);
                }
                
            res.redirect('/passwords')
        } catch (err) {
            console.log("Error")
            console.log(err)
            res.status(500).render('error', { message: 'Server error' });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, username, password } = req.body;

            const encryptedPassword = encrypt(password);

            const isCurrUser = await Password.findById(id)
            
            if(!isCurrUser ||isCurrUser.userId.toString() !== req.session.user._id)
                {
                    return res.redirect('/passwords')
                }
            console.log('girdi')
            await Password.findByIdAndUpdate(id, { 
                title:  title,
                username:  username,
                password: encryptedPassword
            })

            res.redirect('/passwords')
        } catch (err) {
            console.log(err)
            res.status(500).render('error', { message: 'Server error' });
        }
    },
    updatePasswordPage: async (req, res) => {
        try {
            const error = req.query.error || null;
            const { id } = req.params;
            const password = await Password.findById(id);
    
            if (!password || password.userId.toString() !== req.session.user._id) {
                return res.status(403).render('error', { message: 'Forbidden' });
            }
    
            const decryptedPassword = {
                ...password._doc,
                password: decrypt(password.password)
            };
    
            res.render('updatePassword', { 
                password: decryptedPassword,
                error: error
            });
        } catch (err) {
            console.log(err);
            res.status(500).render('error', { message: 'Server error' });
        }
    }
}

module.exports = passwordController