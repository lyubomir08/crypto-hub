import authService from '../services/authService.js';

const updateUser = async (req, res) => {
    const userId = req.userId;
    const { username, email, profileImage } = req.body;

    try {
        const updatedUser = await authService.updateUserProfile(userId, { username, email, profileImage });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        if (!req.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        const users = await authService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const register = async (req, res) => {
    const { username, email, password, rePassword, profileImage } = req.body;

    try {
        const newUser = await authService.registerUser(username, email, password, rePassword, profileImage);
        res.status(201).json({ id: newUser.id, username: newUser.username, email: newUser.email, profileImage: newUser.profileImage });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userData = await authService.loginUser(email, password);
        res.cookie("auth", userData.token, { httpOnly: true, sameSite: 'none', secure: true });
        res.json({ id: userData.id, username: userData.username, email: userData.email });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const getProfileInfo = async (req, res) => {
    const userId = req.userId;

    try {
        const userProfile = await authService.getUserProfile(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('auth', { path: '/' });
    res.status(200).send({ message: 'Logout successful' });
};

export default { register, login, logout, getProfileInfo, updateUser, getAllUsers };
