const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const GeneratorSchema = new mongoose.Schema({
  name: String,
  images: [{ url: String }]
});

const Generator = mongoose.models.Generator || mongoose.model('Generator', GeneratorSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    const gens = await Generator.find();
    console.log('Generators count:', gens.length);
    console.log('Generators:', JSON.stringify(gens, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
