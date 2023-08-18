const express = require('express');
const router = express.Router();

const fileUpload = require('@middleware/reclamationfilesUpload');
const controllers = require('../controllers/reclamationFile');

// router.post('/reclamation/upload_files', fileUpload.array('files'), controllers.attachFiles);
router.post('/reclamation_file', controllers.attachFiles);
router.get('/reclamation/file/:id', controllers.getFile);
router.get('/reclamation_file', controllers.getSubjectFiles);
router.delete('/eclamation/file/:id', controllers.removeFile);

module.exports = router;
