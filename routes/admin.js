const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/add-relief', adminController.getAddRelief);
router.post('/add-relief', adminController.postAddRelief);
router.get('/relief-requests', adminController.getReliefRequests);
router.get('/teams', adminController.getTeams);
router.get('teams/:teamId', adminController.getTeamDetails);
router.get('/add-team', adminController.getAddTeam);
router.post('/add-team', adminController.postAddTeam);
router.get('/', adminController.getReliefRequests);

module.exports = router;