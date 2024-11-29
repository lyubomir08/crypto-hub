import authService from '../services/authService.js';

const register = async (req, res) => {
    const { username, email, password, rePassword } = req.body;

    try {
        const newUser = await authService.registerUser(username, email, password, rePassword);
        res.cookie("auth", newUser.token, { httpOnly: true, sameSite: 'none', secire: true });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userData = await authService.loginUser(email, password);
        res.cookie("auth", userData.token, { httpOnly: true, sameSite: 'none', secure: true });
        res.json(userData);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    res.clearCookie('auth');
};

export default { register, login };
