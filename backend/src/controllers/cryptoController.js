import cryptoService from '../services/cryptoService.js';

const getAllCryptos = async (req, res) => {
    try {
        const cryptos = await cryptoService.getAllCryptos();
        res.json(cryptos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCryptoById = async (req, res) => {
    const { id } = req.params;

    try {
        const crypto = await cryptoService.getCryptoById(id);
        if (!crypto) return res.status(404).json({ message: 'Cryptocurrency not found' });
        res.json(crypto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addCrypto = async (req, res) => {
    const { name, symbol, currentPrice, description, imageUrl } = req.body;

    try {
        const userId = req.userId;
        const newCrypto = await cryptoService.addCrypto(name, symbol, currentPrice, description, imageUrl, userId);
        res.status(201).json(newCrypto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCrypto = async (req, res) => {
    const { id } = req.params;
    const { name, symbol, currentPrice, description, imageUrl } = req.body;

    try {
        const crypto = await cryptoService.getCryptoById(id);

        if (!crypto || crypto.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this cryptocurrency' });
        }

        const updatedCrypto = await cryptoService.updateCrypto(id, name, symbol, currentPrice, description, imageUrl);
        res.json(updatedCrypto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCrypto = async (req, res) => {
    const { id } = req.params;

    try {
        const crypto = await cryptoService.getCryptoById(id);

        if (!crypto || crypto.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this cryptocurrency' });
        }

        await cryptoService.deleteCrypto(id);
        res.json({ message: 'Cryptocurrency deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchCryptos = async (req, res) => {
    const { query } = req.query;

    try {
        const cryptos = await cryptoService.searchCryptos(query);
        res.json(cryptos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    try {
        const userId = req.userId;
        const comment = await cryptoService.addComment(id, userId, text);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default {
    getAllCryptos,
    getCryptoById,
    addCrypto,
    updateCrypto,
    deleteCrypto,
    searchCryptos,
    addComment,
};
