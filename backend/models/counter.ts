import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  count: { type: Number, required: true },
}, {
  timestamps: true,
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;