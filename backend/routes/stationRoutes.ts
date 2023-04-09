// stationRoutes.ts
import express from 'express';
import { addStation, getStation, getStations } from '../controllers/stationController';

const router = express.Router();

router.route('/').get(getStations).post(addStation);
router.route('/:id').get(getStation)

export default router;