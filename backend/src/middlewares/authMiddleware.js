import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.cookies['auth'];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.isAuthenticated = true;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
