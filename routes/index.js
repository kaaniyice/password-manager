const express = require('express')
const router = express.Router()

const  authenticator  = require('../middleware/auth')

const home = require('./modules/home')
const users = require('./modules/user')
const password = require('./modules/password')

router.use('/', home);
router.use('/users', users)
router.use('/passwords', authenticator, password);

module.exports = router