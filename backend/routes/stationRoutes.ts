const express = require('express');
const { addStation, getStation, getStations } = require('../controllers/stationController');

const router = express.Router();

router.route('/').get(getStations).post(addStation);
router.route('/:id').get(getStation)

export default router;