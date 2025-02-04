import articleService from '../services/articleService.js';

const createArticle = async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.userId;

    try {
        const article = await articleService.createArticle(title, content, authorId);
        res.status(201).json({ message: 'Статията е изпратена за одобрение', article });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getApprovedArticles = async (req, res) => {
    try {
        const articles = await articleService.getApprovedArticles();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingArticles = async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: 'Нямате права за достъп' });
    }

    try {
        const articles = await articleService.getPendingArticles();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveOrRejectArticle = async (req, res) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: 'Нямате права за достъп' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Невалиден статус' });
    }

    try {
        const article = await articleService.updateArticleStatus(id, status);
        res.status(200).json({
            message: `Статията е ${status === 'approved' ? 'одобрена' : 'отхвърлена'}`,
            article
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export default {
    createArticle,
    getApprovedArticles,
    getPendingArticles,
    approveOrRejectArticle
};
