const express = require('express');
const router = express.Router();

const controllersInfo = require('../controllers/index');
const controllersGetWeight = require('../controllers/getWeight');
const accessRights = require('@middleware/accessRights');

router.get('/scale', accessRights.canRead('scales'), controllersInfo.findAll);
router.get('/scale/:id', accessRights.canRead('scales'), controllersInfo.findById);
router.get('/scale_by_name/:name', accessRights.canRead('scales'), controllersInfo.findByName);
router.post('/scale', accessRights.canModify('scales'), controllersInfo.create);
router.put('/scale/:id', accessRights.canModify('scales'), controllersInfo.update);
router.delete('/scale/:id', accessRights.canModify('scales'), controllersInfo.delete);


//get weight request
router.get('/scaleGet/getWeight/:id', accessRights.canRead('scales'), controllersGetWeight.getWeightById);


//get photo request
router.get('/scaleGet/photo/:id/:deliveryNote', accessRights.canRead('scales'), controllersGetWeight.getPhototoScale);


//test router mesy be rewritten
router.get('/getPhotoForDeliveryNoted/', accessRights.canRead('scales'), controllersGetWeight.getPhotoBuffer);

module.exports = router;