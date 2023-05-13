import express from 'express';
const router = express.Router();
import { getJourneys } from '../controllers/journeyController';

router.route('/').get(getJourneys);

export default router;
