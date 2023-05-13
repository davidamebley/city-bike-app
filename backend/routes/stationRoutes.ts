import express from 'express';
const router = express.Router();
import { addStation, getStation, getStations } from '../controllers/stationController';

router.route('/').get(getStations).post(addStation);
router.route('/:id').get(getStation);

export default router;