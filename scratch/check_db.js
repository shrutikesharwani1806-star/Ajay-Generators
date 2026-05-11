const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Generator = require('./backend/models/Generator');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const count = await Generator.countDocuments();
    console.log('Total Generators:', count);
    const gens = await Generator.find().limit(5);
    console.log('Sample Generators:', JSON.stringify(gens, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkDB();
