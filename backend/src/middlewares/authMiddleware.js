import jwt from '../utils/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = async (req, res, next) => {
    const token = req.cookies['auth'];

    if (!token) {
        return next();
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.isAuthenticated = true;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
