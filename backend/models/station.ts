// station.ts
import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  id: String,
  name: String,
  address: String,
});

const Station = mongoose.model('Station', stationSchema);
export default Station;
