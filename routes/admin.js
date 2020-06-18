const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/add-relief', adminController.getAddRelief);
router.post('/add-relief', adminController.postAddRelief);
router.get('/relief-requests', adminController.getReliefRequests);
router.get('/', adminController.getReliefRequests);

module.exports = router;