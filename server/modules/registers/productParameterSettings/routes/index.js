const express = require('express');
const Controller = require('../controllers');

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Praktyk B2B' });
});

router.get('/product_param_setting', Controller.findAll);

module.exports = router;
