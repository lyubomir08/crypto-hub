import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
        unique: true,
    },
    currentPrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Crypto', cryptoSchema);
