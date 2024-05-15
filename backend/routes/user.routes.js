
const express = require('express');
const { login, logout, updateUser, register, getUser } = require('../controllers/user.controller');
const isLoggedIn = require('../middleware/auth.guard');
const { validateRegister, validateLogin } = require('../middleware/user.validator');
const router = express.Router();

router.post('/register', validateRegister, register);

router.post('/login', validateLogin, login);

router.get('/logout', logout);

router.put('/update', isLoggedIn, updateUser);

router.get('/', isLoggedIn, getUser);

module.exports = router;