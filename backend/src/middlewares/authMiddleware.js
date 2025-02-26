import jwt from "../utils/jwt.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies['auth'];

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated. Token is missing.' });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        req.isAdmin = decoded.email === process.env.ADMIN_EMAIL;
        req.isAuthenticated = true;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export default authMiddleware;
