const express = require('express')
const router = express.Router()

const passwordController = require('../../controllers/passwordController')

router.get('/', passwordController.getPassword)

router.get('/add', passwordController.addPasswordPage)
router.post('/add', passwordController.addPasword)

router.get('/delete/:id', passwordController.deletePassword)

router.get('/update/:id', passwordController.updatePasswordPage)
router.post('/update/:id', passwordController.updatePassword)

module.exports = router