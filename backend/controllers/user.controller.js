
const userModel = require('../models/user.model');

async function login(req, res) {
    try {
        const result = await userModel.findWithPassword(req.body.email, req.body.password);
        if (result) {
            req.session.email = req.body.email;
            res.send(result);
        } else {
            res
                .status(401)
                .send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res
            .status(500)
            .send('An error occurred while logging in');
    }
}

async function logout(req, res) {
    try {
        await req.session.destroy();
        res.send('Logged out successfully');
    } catch (error) {
        console.error('Error logging out:', error);
        res
            .status(500)
            .send('An error occurred while logging out');
    }
}

async function register(req, res) {
    try {
        const result = await userModel.create(req.body);
        req.session.email = req.body.email;
        res.send(result);
    } catch (error) {
        console.error('Error creating user:', error);
        res
            .status(500)
            .send('An error occurred while creating the user (maybe email is already taken)');
    }
}

async function getUser(req, res) {
    try {
        const result = await userModel.find(req.session.email);
        res.send(result);
    } catch (error) {
        console.error('Error finding user:', error);
        res
            .status(500)
            .send('An error occurred while finding the user');
    }
}

async function updateUser(req, res) {
    try {
        req.body.email = req.session.email;
        req.body.password = undefined;
        const result = await userModel.update(req.session.email, req.body);
        res.send(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res
            .status(500)
            .send('An error occurred while updating the user');
    }
}

module.exports = {
    login,
    logout,
    register,
    getUser,
    updateUser,
};