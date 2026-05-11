import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  generator: { type: String },
  city: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending' }
}, { timestamps: true });

const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
export default Quote;
