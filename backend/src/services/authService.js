import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from '../utils/jwt.js';

const generateToken = async (userId) => {
    return await jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
};

const registerUser = async (username, email, password, rePassword) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('A user with this email already exists.');
    }

    if (rePassword !== password) {
        throw new Error('Passwords do not match.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword });

    const token = await generateToken(newUser._id);

    return {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token,
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = await generateToken(user._id);

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        token,
    };
};

export default { registerUser, loginUser };
