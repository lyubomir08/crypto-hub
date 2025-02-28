import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userController from './controllers/userController.js';
import cryptoController from './controllers/cryptoController.js';
import articleController from './controllers/articleController.js';
import authMiddleware from './middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cryptoApp';

const corsOptions = {
    origin: ['http://localhost:4200', 'https://lyubomir08.github.io'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);
app.post('/api/users/logout', authMiddleware, userController.logout);
app.put('/api/users/update', authMiddleware, userController.updateUser);
app.get('/api/users', authMiddleware, userController.getAllUsers);
app.delete('/api/users/:userId', authMiddleware, userController.deleteUser);

app.get('/api/users/profile', authMiddleware, userController.getProfileInfo);

app.get('/api/cryptos', cryptoController.getAllCryptos);
app.get('/api/cryptos/:id/details', cryptoController.getCryptoById);
app.post('/api/cryptos/create', authMiddleware, cryptoController.addCrypto);
app.put('/api/cryptos/:id/edit', authMiddleware, cryptoController.updateCrypto);
app.delete('/api/cryptos/:id/delete', authMiddleware, cryptoController.deleteCrypto);
app.get('/api/cryptos/search', cryptoController.searchCryptos);

app.post('/api/cryptos/:id/comments', authMiddleware, cryptoController.addComment);
app.put('/api/cryptos/:id/comments/:commentId', authMiddleware, cryptoController.updateComment);
app.delete('/api/cryptos/:id/comments/:commentId', authMiddleware, cryptoController.deleteComment);

app.post('/api/articles', authMiddleware, articleController.createArticle);
app.get('/api/articles', articleController.getApprovedArticles);

app.get('/api/admin/articles/pending', authMiddleware, articleController.getPendingArticles);
app.patch('/api/admin/articles/:id', authMiddleware, articleController.approveOrRejectArticle);
app.delete('/api/admin/articles/:id', authMiddleware, articleController.deleteArticle);

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
