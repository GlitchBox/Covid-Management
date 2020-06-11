const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organization');

router.get('/add-relief', organizationController.getAddRelief);
router.post('/add-relief', organizationController.postAddRelief);

module.exports = router;