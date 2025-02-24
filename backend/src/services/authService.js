import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from '../utils/jwt.js';

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

const registerUser = async (username, email, password, rePassword, profileImage) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('A user with this email already exists.');
    }

    if (rePassword !== password) {
        throw new Error('Passwords do not match.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword, profileImage: profileImage || '' });

    return {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage
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

    const token = await generateToken(user);

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        token,
    };
};

const getUserProfile = async (userId) => {
    const user = await User.findById(userId, { password: 0, __v: 0 });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const updateUserProfile = async (userId, { username, email, profileImage }) => {
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (profileImage) updatedFields.profileImage = profileImage;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true, fields: { password: 0 } });

    if (!updatedUser) {
        throw new Error('User not found or update failed');
    }

    return updatedUser;
};

const getAllUsers = async () => {
    const users = await User.find({}, { password: 0, __v: 0 });
    if (!users.length) {
        throw new Error('No users found');
    }
    return users;
};

const deleteUserById = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new Error("User not found.");
    }
    return { message: "User deleted successfully." };
};

export default { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers, deleteUserById };
