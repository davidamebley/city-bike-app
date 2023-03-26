// journeyRoutes.ts
import express from 'express';

import {getJourneys}  from '../controllers/journeyController';

const router = express.Router();

router.route('/').get(getJourneys)

export default router;
