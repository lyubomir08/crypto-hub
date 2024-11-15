import cryptoService from '../services/cryptoService.js';

const getAllCryptos = async (req, res) => {
    try {
        const cryptos = await cryptoService.getAllCryptos();
        res.json(cryptos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addCrypto = async (req, res) => {
    const { name, symbol, currentPrice, description, imageUrl } = req.body;

    try {
        const newCrypto = await cryptoService.addCrypto(name, symbol, currentPrice, description, imageUrl);
        res.status(201).json(newCrypto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCrypto = async (req, res) => {
    const { id } = req.params;
    const { name, symbol, currentPrice, description, imageUrl } = req.body;

    try {
        const updatedCrypto = await cryptoService.updateCrypto(id, name, symbol, currentPrice, description, imageUrl);
        if (!updatedCrypto) {
            return res.status(404).json({ message: 'Cryptocurrency not found' });
        }
        res.json(updatedCrypto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCrypto = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCrypto = await cryptoService.deleteCrypto(id);
        if (!deletedCrypto) {
            return res.status(404).json({ message: 'Cryptocurrency not found' });
        }
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

export default { getAllCryptos, addCrypto, updateCrypto, deleteCrypto, searchCryptos };
