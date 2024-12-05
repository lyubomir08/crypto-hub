import Crypto from '../models/Crypto.js';

const getAllCryptos = async () => {
    return await Crypto.find();
};

const addCrypto = async (name, symbol, currentPrice, description, imageUrl, owner) => {
    return await Crypto.create({ name, symbol, currentPrice, description, imageUrl, owner });
};

const updateCrypto = async (id, name, symbol, currentPrice, description, imageUrl) => {
    const updatedCrypto = await Crypto.findByIdAndUpdate(
        id,
        { name, symbol, currentPrice, description, imageUrl },
        { new: true, runValidators: true }
    );

    if (!updatedCrypto) throw new Error('Cryptocurrency not found');
    return updatedCrypto;
};

const deleteCrypto = async (id) => {
    const deletedCrypto = await Crypto.findByIdAndDelete(id);
    if (!deletedCrypto) throw new Error('Cryptocurrency not found');
    return deletedCrypto;
};

const searchCryptos = async (name, symbol) => {
    let query = {};

    if (name) {
        query.name = new RegExp(name, 'i');
    }

    if (symbol) {
        query.symbol = new RegExp(symbol, 'i');
    }

    return await Crypto.find(query);
};

const getCryptoById = async (id) => {
    const crypto = await Crypto.findById(id)
        .populate('owner', 'username email')
        .populate({
            path: 'comments.user',
            select: 'username email',
        });
        
    if (!crypto) throw new Error('Cryptocurrency not found');
    return crypto;
};

const addComment = async (cryptoId, userId, text) => {
    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) throw new Error('Cryptocurrency not found');

    const comment = { user: userId, text, createdAt: new Date() };

    crypto.comments.push(comment);
    await crypto.save();

    await crypto.populate({
        path: 'comments.user',
        select: 'username email',
    });

    const populatedComment = crypto.comments[crypto.comments.length - 1];
    return populatedComment;
};

const updateComment = async (cryptoId, commentId, userId, text) => {
    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) throw new Error('Cryptocurrency not found');

    const comment = crypto.comments.id(commentId);
    if (!comment) throw new Error('Comment not found');

    if (comment.user.toString() !== userId) {
        throw new Error('Unauthorized to update this comment');
    }

    comment.text = text;
    await crypto.save();
    return comment;
};

const deleteComment = async (cryptoId, commentId, userId) => {
    const crypto = await Crypto.findById(cryptoId);
    if (!crypto) throw new Error('Cryptocurrency not found');

    const comment = crypto.comments.id(commentId);
    if (!comment) throw new Error('Comment not found');

    if (comment.user.toString() !== userId) {
        throw new Error('Unauthorized to delete this comment');
    }

    comment.remove();
    await crypto.save();
    return { message: 'Comment deleted successfully' };
};

export default {
    getAllCryptos,
    addCrypto,
    updateCrypto,
    deleteCrypto,
    searchCryptos,
    getCryptoById,
    addComment,
    updateComment,
    deleteComment
};
