const express = require('express')
const router = express.Router();

const UserController = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')
router.post('/signup' ,UserController.signup)
router.post('/login' , UserController.login)
router.delete('/:deleteId',checkAuth , UserController.delete)

module.exports = router