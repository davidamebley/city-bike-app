// journeys.ts
import express from 'express';

import Journey from '../models/journey';
import {getJourneys}  from '../controllers/journeyController';

const router = express.Router();

router.route('/').get(getJourneys)

export default router;
