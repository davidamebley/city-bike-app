// journey.ts
import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  departure: Date,
  return: Date,
  departureStationId: String,
  departureStationName: String,
  returnStationId: String,
  returnStationName: String,
  coveredDistance: Number,
  duration: Number,
});

const Journey = mongoose.model('Journey', journeySchema);
export default Journey;