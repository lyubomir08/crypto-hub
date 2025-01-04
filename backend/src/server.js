import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { WebSocketServer } from 'ws'; // WebSocket сървър
import http from 'http'; // За съвместна работа на HTTP и WebSocket
import userController from './controllers/userController.js';
import cryptoController from './controllers/cryptoController.js';
import chatController from './controllers/chatController.js';
import authMiddleware from './middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';
import Message from './models/Message.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // HTTP сървър за Express и WebSocket
const wss = new WebSocketServer({ server }); // Създаване на WebSocket сървър
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
app.post('/api/users/logout', userController.logout);
app.put('/api/users/update', authMiddleware, userController.updateUser);
app.get('/api/users', authMiddleware, userController.getAllUsers);

app.get('/api/users/profile', authMiddleware, userController.getProfileInfo);

app.get('/api/chat/messages', authMiddleware, chatController.getMessages);
app.post('/api/chat/send', authMiddleware, chatController.sendMessage);

app.get('/api/cryptos', cryptoController.getAllCryptos);
app.get('/api/cryptos/:id/details', cryptoController.getCryptoById);
app.post('/api/cryptos/create', authMiddleware, cryptoController.addCrypto);
app.put('/api/cryptos/:id/edit', authMiddleware, cryptoController.updateCrypto);
app.delete('/api/cryptos/:id/delete', authMiddleware, cryptoController.deleteCrypto);
app.get('/api/cryptos/search', cryptoController.searchCryptos);

app.post('/api/cryptos/:id/comments', authMiddleware, cryptoController.addComment);
app.put('/api/cryptos/:id/comments/:commentId', authMiddleware, cryptoController.updateComment);
app.delete('/api/cryptos/:id/comments/:commentId', authMiddleware, cryptoController.deleteComment);

// Свързване към MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const clients = new Map();

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    // Получаване на съобщения от клиента
    ws.on('message', async (data) => {
        const message = JSON.parse(data);

        if (message.type === 'INIT') {
            // Свързване на потребител към WebSocket
            clients.set(message.userId, ws);
            console.log(`User ${message.userId} connected`);
        }

        if (message.type === 'MESSAGE') {
            const { senderId, recipientId, content } = message;

            // Съхраняване на съобщението в MongoDB
            const newMessage = new Message({ sender: senderId, recipient: recipientId, content });
            await newMessage.save();

            // Изпращане на съобщението до получателя, ако е онлайн
            const recipientSocket = clients.get(recipientId);
            if (recipientSocket) {
                recipientSocket.send(JSON.stringify({
                    senderId,
                    recipientId,
                    content,
                    timestamp: new Date(),
                }));
            }
        }
    });

    // Когато връзката бъде затворена
    ws.on('close', () => {
        clients.forEach((socket, userId) => {
            if (socket === ws) clients.delete(userId);
        });
        console.log('WebSocket connection closed');
    });
});

const startServer = async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
