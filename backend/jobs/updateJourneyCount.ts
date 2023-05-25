import cron from 'node-cron';
import NodeCache from 'node-cache';

import Journey from '../models/journey';
import Counter from '../models/counter';

const cache = new NodeCache();

export default async function startJourneyCountUpdateJob() {
  // Run the job immediately on server startup
  await updateJourneyCount();

  // Then schedule the job to run at a regular interval
  cron.schedule('*/5 * * * *', updateJourneyCount); // every 5 mins
}

async function updateJourneyCount(){
  const journeyCount = await Journey.countDocuments();
  await Counter.updateOne(
    { _id: 'journeyCount' },
    { $set: { count: journeyCount } },
    { upsert: true },
  );

  // Invalidate the cache
  cache.del('totalCount');
}
