const express = require('express');
const appController = require('../controllers');

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Praktyk B2B' });
});

const namespace = 'navigation';

router.get(`/${namespace}`, appController.findAll);
router.get(`/${namespace}/:id`, appController.findById);
router.post(`/${namespace}`, appController.update);

module.exports = router;
