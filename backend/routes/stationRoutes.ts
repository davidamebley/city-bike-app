// stationRoutes.ts
import express from 'express';
import Station from '../models/station';
import Journey from '../models/journey';
import { getStation, getStations } from '../controllers/stationController';

const router = express.Router();

router.route('/').get(getStations)
router.route('/:id').get(getStation)

export default router;