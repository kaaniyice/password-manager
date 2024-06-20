const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if (req.session.user){
        const user = req.session.user;
        res.render('index', { user } )
    }
    else{
        res.redirect('/users/login');
    }
});

module.exports = router