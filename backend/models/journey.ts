// journey.ts
import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  departure: Date,
  return: Date,
  departure_station_id: String,
  departure_station_name: String,
  return_station_id: String,
  return_station_name: String,
  covered_distance: Number,
  duration: Number,
});

const Journey = mongoose.model('Journey', journeySchema);
export default Journey;