import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userController from './controllers/userController.js';
import cryptoController from './controllers/cryptoController.js';
import authMiddleware from './middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cryptoApp';

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);
app.get('/api/users/logout', userController.logout);

app.get('/api/users/profile',  authMiddleware, userController.getProfileInfo);

app.get('/api/cryptos', cryptoController.getAllCryptos);
app.get('/api/cryptos/:id/details', cryptoController.getCryptoById);
app.post('/api/cryptos/create', authMiddleware, cryptoController.addCrypto);
app.put('/api/cryptos/:id', authMiddleware, cryptoController.updateCrypto);
app.delete('/api/cryptos/:id', authMiddleware, cryptoController.deleteCrypto);
app.get('/api/cryptos/search', cryptoController.searchCryptos);

app.post('/api/cryptos/:id/comments', authMiddleware, cryptoController.addComment);

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
