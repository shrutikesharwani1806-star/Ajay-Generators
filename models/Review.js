import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  generator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Generator',
  },
  name: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  avatar: String,
  isApproved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
