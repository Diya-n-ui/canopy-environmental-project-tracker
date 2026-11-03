import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  type: { type: String, required: true, enum: ['Afforestation', 'Restoration', 'Conservation', 'Waste Management', 'Renewable Energy', 'Other'] },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed', 'On Hold'], default: 'Planned' },
  treesPlanted: { type: Number, required: true, min: 0, default: 0 },
  targetTrees: { type: Number, required: true, min: 0, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

projectSchema.pre('validate', function(next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be on or after start date.');
  }
  next();
});

export default mongoose.model('Project', projectSchema);
