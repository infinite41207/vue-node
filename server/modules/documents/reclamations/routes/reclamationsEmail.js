const express = require('express');

const itemController = require('../controllers/reclamationEmail');
const router = express.Router();

router.post('/createreclamationemail', itemController.createItem);
router.get('/getallreclamationemails', itemController.getAllItems);
router.get('/getreclamationemail/:id', itemController.getItemDetails);
router.put('/updatereclamationemail', itemController.updateItem);
router.post('/deletereclamationemail', itemController.deleteItem);

module.exports = router;
