import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  featureType: { type: String, required: true }, // 'content', 'component', 'docs', 'invoice'
  promptData: { type: Object, required: true }, 
  resultData: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('History', historySchema);
