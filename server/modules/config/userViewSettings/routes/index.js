const express = require('express')
const controllers = require('../controllers')

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'SYNERGY' })
})

const namespace = 'user_view_settings'

router.get(`/${namespace}`, controllers.findAll)
router.get(`/${namespace}/:id`, controllers.findById)
router.post(`/${namespace}`, controllers.create)
router.put(`/${namespace}/:id`, controllers.update)
router.delete(`/${namespace}/:id`, controllers.delete)

module.exports = router
