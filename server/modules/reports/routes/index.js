const express = require('express')
const router = express.Router()

const controllers = require('../controllers');

const reportOrderListController = require('../controllers/orderList')
const reportReclamationListController = require('../controllers/reclamationList')
const reportCustomerRequestListController = require('../controllers/customerRequestList')
const reportCustomerRequestListMController = require('../controllers/customerRequestListM')
const reportEnovaSalesController = require('../controllers/enovaSalesList')
const shiftReportFromScaleController = require('../controllers/shiftReportFromScale')
const collectiveWeightCertificateController = require('../controllers/collectiveWeightCertificate')
const collectiveWeightCertificateGeneralController = require('../controllers/collectiveWeightCertificateGeneral')
const dispositionListController = require('../controllers/dispositionList')
const dispositionReportController = require('../controllers/dispositionReport')
const collectiveRailwayScaleCertificateController = require('../controllers/collectiveRailwayScaleCertificate')
const reportApprovedRailway = require('../controllers/approvedRailway')
const shiftReportApprovedRailway = require('../controllers/shiftApprovedRailway')
const btsShiftReportController = require('../controllers/btsShiftReport')
const customerRequestList = require("../controllers/customerRequestList")
const orderList = require("../controllers/orderList")

router.get('/report', controllers.findAll);
router.get('/report/:id', controllers.findById);
router.post('/report', controllers.create);
router.put('/report/:id', controllers.update);
router.delete('/report/:id', controllers.delete);

router.get('/report/settings/reportReclamationList', reportReclamationListController.getStartData)
router.get('/report/settings/reportCustomerRequestList', reportCustomerRequestListController.getStartData)
router.get('/report/settings/reportCustomerRequestListM', reportCustomerRequestListMController.getStartData)
router.get('/report/settings/shiftReportFromScale', shiftReportFromScaleController.getStartData)
router.get('/report/settings/dispositionReport', dispositionReportController.getStartData)
router.get('/report/settings/collectiveRailwayScaleCertificate', collectiveRailwayScaleCertificateController.getStartData)
router.get('/report/settings/dispositionList', dispositionListController.getStartData)
router.get('/report/settings/collectiveWeightCertificate', collectiveWeightCertificateController.getStartData)
router.get('/report/settings/collectiveWeightCertificateGeneral', collectiveWeightCertificateGeneralController.getStartData)
router.get('/report/settings/dispositionList', dispositionListController.getStartData)
router.get('/report/settings/dispositionReport', dispositionReportController.getStartData)
router.get('/report/settings/shiftReportApprovedRailway', shiftReportApprovedRailway.getStartData)
router.get('/report/settings/reportApprovedRailway', reportApprovedRailway.getStartData)
router.get('/report/settings/btsShiftReport' , btsShiftReportController.getStartData)
router.get('/report/settings/customerRequestList' , customerRequestList.getStartData)
router.get('/report/settings/orderList' , orderList.getStartData)

router.post('/report/result/reportReclamationList', reportReclamationListController.getDataReport)
router.post('/report/result/reportCustomerRequestList', reportCustomerRequestListController.getDataReport)
router.post('/report/result/reportCustomerRequestListM', reportCustomerRequestListMController.getDataReport)
router.post('/report/result/shiftReportFromScale', shiftReportFromScaleController.getDataReport)
router.post('/report/result/dispositionReport', dispositionReportController.getDataReport)
router.post('/report/result/collectiveRailwayScaleCertificate', collectiveRailwayScaleCertificateController.getDataReport)
router.post('/report/result/dispositionList', dispositionListController.getDataReport)
router.post('/report/result/collectiveWeightCertificate', collectiveWeightCertificateController.getDataReport)
router.post('/report/result/collectiveWeightCertificateGeneral', collectiveWeightCertificateGeneralController.getDataReport)
router.post('/report/result/dispositionList', dispositionListController.getDataReport)
router.post('/report/result/dispositionReport', dispositionReportController.getDataReport)
router.post('/report/result/shiftReportApprovedRailway', shiftReportApprovedRailway.getDataReport)
router.post('/report/result/reportApprovedRailway', reportApprovedRailway.getDataReport)
router.post('/report/result/btsShiftReport' , btsShiftReportController.getDataReport)
router.post('/report/result/customerRequestList' , customerRequestList.getDataReport)
router.post('/report/result/orderList' , orderList.getDataReport)

router.post('/report/order_list', reportOrderListController.getDataReport)
router.post('/report/enovasales_list', reportEnovaSalesController.getDataReport)

module.exports = router