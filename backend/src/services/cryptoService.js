import Crypto from '../models/Crypto.js';

const getAllCryptos = async () => {
    return await Crypto.find();
};

const addCrypto = async (name, symbol, variants) => {
    return await Crypto.create({ name, symbol, variants });
};

const updateCrypto = async (id, name, symbol, variants) => {
    return await Crypto.findByIdAndUpdate(
        id,
        { name, symbol, variants },
        { new: true, runValidators: true }
    );
};

const deleteCrypto = async (id) => {
    return await Crypto.findByIdAndDelete(id);
};

const searchCryptos = async (query) => {
    return await Crypto.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { symbol: { $regex: query, $options: 'i' } },
        ],
    });
};

const getCryptoById = async (id) => {
    const crypto = await Crypto.findById(id);
    if (!crypto) throw new Error('Cryptocurrency not found');
    return crypto;
};

export default { getAllCryptos, addCrypto, updateCrypto, deleteCrypto, searchCryptos, getCryptoById };
