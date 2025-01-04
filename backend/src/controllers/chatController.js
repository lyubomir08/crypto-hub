import chatService from '../services/chatService.js';

const getMessages = async (req, res) => {
    const { senderId, recipientId } = req.query;

    if (!senderId || !recipientId) {
        return res.status(400).json({ error: 'Sender and recipient are required.' });
    }

    try {
        const messages = await chatService.getMessages(senderId, recipientId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
};

const sendMessage = async (req, res) => {
    const { senderId, recipientId, content } = req.body;

    if (!senderId || !recipientId || !content) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const message = await chatService.sendMessage(senderId, recipientId, content);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message.' });
    }
};

export default { getMessages, sendMessage };
