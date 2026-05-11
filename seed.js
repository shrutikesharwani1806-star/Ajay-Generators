const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const generatorSchema = new mongoose.Schema({
  name: String,
  slug: String,
  capacity: String,
  powerOutput: String,
  fuelType: String,
  fuelConsumption: String,
  description: String,
  shortDescription: String,
  images: [{ public_id: String, url: String }],
  pricing: { daily: Number, weekly: Number, monthly: Number, yearly: Number },
  specifications: Object,
  features: [String],
  availability: { type: String, default: 'available' },
  category: String,
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Generator = mongoose.models.Generator || mongoose.model('Generator', generatorSchema);

const generators = [
  {
    name: 'Industrial Power Pro',
    capacity: '35KV',
    powerOutput: '35 kVA / 28 kW',
    fuelConsumption: '6.5 L/h',
    description: 'Heavy-duty industrial generator for continuous power supply in manufacturing and large-scale operations.',
    shortDescription: 'Industrial Grade Power',
    images: [{ url: '/images/industry_generator.jpg' }],
    pricing: { daily: 800, monthly: 35000 },
    category: 'industrial',
    isFeatured: true
  },
  {
    name: 'Construction Site Master',
    capacity: '30KV',
    powerOutput: '30 kVA / 24 kW',
    fuelConsumption: '5.8 L/h',
    description: 'Robust and portable generator designed for the tough conditions of construction sites.',
    shortDescription: 'Rugged Construction Power',
    images: [{ url: '/images/cunstruction_site_generator.jpg' }],
    pricing: { daily: 800, monthly: 30000 },
    category: 'construction',
    isFeatured: true
  },
  {
    name: 'Luxury Hotel Silent Series',
    capacity: '30KV',
    powerOutput: '30 kVA / 24 kW',
    fuelConsumption: '5.5 L/h',
    description: 'Ultra-silent generator perfect for hotels, hospitals, and residential complexes where noise is a concern.',
    shortDescription: 'Silent Hospitality Power',
    images: [{ url: '/images/hotel_room_generator.jpg' }],
    pricing: { daily: 800, monthly: 30000 },
    category: 'commercial',
    isFeatured: true
  },
  {
    name: 'Event & Party Special',
    capacity: '35KV',
    powerOutput: '35 kVA / 28 kW',
    fuelConsumption: '6.8 L/h',
    description: 'Reliable power for outdoor events, weddings, and party lawns with stable voltage output.',
    shortDescription: 'Event Ready Power',
    images: [{ url: '/images/party_lawn_generator.jpg' }],
    pricing: { daily: 800, monthly: 35000 },
    category: 'wedding',
    isFeatured: true
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await Generator.deleteMany({});
    console.log('Cleared existing generators');
    
    for (const gen of generators) {
      gen.slug = gen.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      gen.powerOutput = gen.powerOutput || 'Standard';
      gen.fuelConsumption = gen.fuelConsumption || 'Optimized';
      await Generator.create(gen);
    }
    
    console.log('Seeding successful! 4 Generators added.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedDB();
