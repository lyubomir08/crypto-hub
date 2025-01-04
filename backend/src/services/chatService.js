import Message from '../models/Message.js';

const getMessages = async (senderId, recipientId) => {
    return Message.find({
        $or: [
            { sender: senderId, recipient: recipientId },
            { sender: recipientId, recipient: senderId },
        ],
    }).sort({ timestamp: 1 });
};

const sendMessage = async (senderId, recipientId, content) => {
    const message = new Message({ sender: senderId, recipient: recipientId, content });
    return message.save();
};

export default { getMessages, sendMessage };
