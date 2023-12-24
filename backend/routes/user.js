const express = require('express');
const { loginUser, signupUser,forgotPassword } = require('../controllers/user');
const user = express.Router();
user.post('/login',loginUser);
user.post('/signup',signupUser);
user.post('/forgot',forgotPassword);

module.exports = user;