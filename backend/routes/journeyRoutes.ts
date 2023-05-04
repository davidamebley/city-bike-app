const express = require('express');

const {getJourneys}  = require('../controllers/journeyController');

const router = express.Router();

router.route('/').get(getJourneys)

export default router;
