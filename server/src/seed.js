import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Project from './models/Project.js';

const demoEmail = 'admin@canopy.local';

try {
  await mongoose.connect(process.env.MONGODB_URI);
  let admin = await User.findOne({ email: demoEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Canopy Demo Admin',
      email: demoEmail,
      passwordHash: await bcrypt.hash('CanopyDemo123!', 12),
      role: 'Admin'
    });
    console.log('Created demo admin.');
  } else {
    console.log('Demo admin already exists; no account changes made.');
  }

  const count = await Project.countDocuments();
  if (count === 0) {
    await Project.insertMany([
      { name: 'Green Bengaluru Initiative', type: 'Afforestation', location: 'Bengaluru, Karnataka', status: 'In Progress', treesPlanted: 600, targetTrees: 1000, startDate: new Date('2026-02-01'), description: 'Urban tree planting and community participation.', createdBy: admin._id },
      { name: 'Lake Edge Restoration', type: 'Restoration', location: 'Mysuru, Karnataka', status: 'Planned', treesPlanted: 0, targetTrees: 500, startDate: new Date('2026-06-01'), description: 'Restore native vegetation around the lake.', createdBy: admin._id },
      { name: 'Community Forest Care', type: 'Conservation', location: 'Tumakuru, Karnataka', status: 'Completed', treesPlanted: 850, targetTrees: 850, startDate: new Date('2025-03-01'), endDate: new Date('2025-12-15'), description: 'Community-led protection of native woodland.', createdBy: admin._id },
      { name: 'Clean Streams Project', type: 'Waste Management', location: 'Mandya, Karnataka', status: 'On Hold', treesPlanted: 120, targetTrees: 300, startDate: new Date('2026-01-10'), description: 'Reduce waste entering local waterways.', createdBy: admin._id }
    ]);
    console.log('Inserted sample projects.');
  } else {
    console.log('Projects already exist; skipped sample data.');
  }
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
