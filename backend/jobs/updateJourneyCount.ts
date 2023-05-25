import cron from 'node-cron';
import mongoose from 'mongoose';

import Journey from '../models/journey';
import Counter from '../models/counter';

export default function startJourneyCountUpdateJob() {
  cron.schedule('0 * * * *', async () => {
    const journeyCount = await Journey.countDocuments();
    await Counter.updateOne(
      { _id: 'journeyCount' },
      { $set: { count: journeyCount } },
      { upsert: true },
    );
  });
}
