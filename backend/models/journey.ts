import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  departure: { type: Date, index: true },
  return: { type: Date, index: true },
  departure_station_id: { type: String, index: true },
  departure_station_name: { type: String, index: true },
  return_station_id: { type: String, index: true },
  return_station_name: { type: String, index: true },
  covered_distance: { type: Number, index: true },
  duration: { type: Number, index: true },
});

const Journey = mongoose.model('Journey', journeySchema);

export default Journey;