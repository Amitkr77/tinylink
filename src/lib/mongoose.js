// lib/mongoose.js
import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    targetUrl: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    lastClicked: { type: Date },
}, { timestamps: true });

export const Link = mongoose.models.Link || mongoose.model('Link', linkSchema);


let cached = null;

export async function connectDB() {
    if (cached) return cached;
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        cached = db;
        console.log('MongoDB connected');
    } catch (e) {
        throw new Error('DB connection failed');
    }
}