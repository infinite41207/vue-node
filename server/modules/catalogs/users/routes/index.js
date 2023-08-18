const express = require('express')
const passportAuth = require('@common/auth/passportAuth')
const userController = require('../controllers')

const router = express.Router()
const accessRights = require('@middleware/accessRights')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Praktyk B2B' })
})

// router.use(passportAuth.isAuthenticated);

router.get('/user', accessRights.canRead('users'), userController.findAll)
router.get('/user/:id', accessRights.canRead('users'), userController.getDetails)
router.post('/user', accessRights.canModify('users'), userController.create)
router.put('/user/:id', accessRights.canModify('users'), userController.update)
router.delete('/user/:id', accessRights.canModify('users'), userController.delete)

module.exports = router
