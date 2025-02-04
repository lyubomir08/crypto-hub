import Article from '../models/Article.js';

const createArticle = async (title, content, authorId) => {
    const article = new Article({ title, content, author: authorId });
    await article.save();
    return article;
};

const getApprovedArticles = async () => {
    return await Article.find({ status: 'approved' }).populate('author', 'username');
};

const getPendingArticles = async () => {
    return await Article.find({ status: 'pending' }).populate('author', 'username');
};

const updateArticleStatus = async (id, status) => {
    const article = await Article.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
    );
    return article;
};

export default {
    createArticle,
    getApprovedArticles,
    getPendingArticles,
    updateArticleStatus
};
