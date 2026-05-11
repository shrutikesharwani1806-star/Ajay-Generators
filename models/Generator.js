import mongoose from 'mongoose';

const generatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Generator name is required'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  capacity: {
    type: String,
    required: true,
    enum: ['30KV', '35KV', '62KV', '82KV', '125KV', '250KV'],
  },
  powerOutput: {
    type: String,
    required: true,
  },
  fuelType: {
    type: String,
    default: 'Diesel',
  },
  fuelConsumption: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
  },
  images: [{
    public_id: String,
    url: String,
  }],
  pricing: {
    daily: { type: Number, required: true },
    weekly: { type: Number },
    monthly: { type: Number },
    yearly: { type: Number },
  },
  specifications: {
    engine: String,
    alternator: String,
    voltage: String,
    frequency: String,
    noiseLevel: String,
    dimensions: String,
    weight: String,
  },
  features: [String],
  availability: {
    type: String,
    enum: ['available', 'rented', 'maintenance'],
    default: 'available',
  },
  availableCities: [{
    state: String,
    city: String,
  }],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  totalRentals: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ['industrial', 'wedding', 'construction', 'commercial', 'emergency', 'residential'],
    default: 'industrial',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

generatorSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const Generator = mongoose.models.Generator || mongoose.model('Generator', generatorSchema);
export default Generator;
