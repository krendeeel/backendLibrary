const Router = require('express')
const router = new Router()
const controller = require('./bookController')


router.post('/add', controller.add)
router.post('/remove', controller.remove)
router.get('/all', controller.all)
router.get('/info', controller.info)
router.get('/reservation', controller.reservation)
router.get('/search', controller.search)


module.exports = router