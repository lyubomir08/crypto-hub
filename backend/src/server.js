import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userController from './controllers/userController.js';
import cryptoController from './controllers/cryptoController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cryptoApp';

app.use(cors());
app.use(express.json());

app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);

app.get('/api/cryptos', cryptoController.getAllCryptos);
app.post('/api/cryptos', cryptoController.addCrypto);
app.put('/api/cryptos/:id', cryptoController.updateCrypto);
app.delete('/api/cryptos/:id', cryptoController.deleteCrypto);
app.get('/api/cryptos/search', cryptoController.searchCryptos);

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
