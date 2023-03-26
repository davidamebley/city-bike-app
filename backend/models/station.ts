// station.ts
import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  _id: String,
  name: String,
  address: String,
  x: Number,
  y: Number,
});

const Station = mongoose.model('Station', stationSchema);
export default Station;
