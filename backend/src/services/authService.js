import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return token;
};

export default { registerUser, loginUser };
