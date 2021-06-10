const Router = require('express')
const router = new Router()
const controller = require('./authController')


router.post('/registration', controller.registration)
router.post('/login', controller.login)
router.post('/user', controller.getUser)

module.exports = router



