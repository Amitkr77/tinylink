// models/Link.js
import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  targetUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  lastClicked: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Link || mongoose.model('Link', linkSchema);