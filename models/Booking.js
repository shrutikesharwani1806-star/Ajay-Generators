import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  generator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Generator',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    fullAddress: { type: String, required: true },
    pincode: String,
  },
  rentalDuration: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  purpose: {
    type: String,
    enum: ['wedding', 'industrial', 'construction', 'commercial', 'emergency', 'residential', 'hospital', 'other'],
    required: true,
  },
  notes: String,
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'processing', 'delivered', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cash'],
    default: 'cash',
  },
  payment: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    amount: Number,
  },
  adminNotes: String,
  deliveryDate: Date,
  returnDate: Date,
  otp: {
    code: String,
    expiresAt: Date,
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
