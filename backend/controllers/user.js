const User = require('../models/user');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token, 'name': user.name })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signupUser = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const user =await  User.signup(email, name, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token, "name":user.name })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}

const forgotPassword = async (req, res) => {
    const { email, password } = req.body;
      try{
        const result = await User.forgotPassword(email,password);
        res.status(200).json({ message: result});
      }
      catch(error) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
      }
}

module.exports = {signupUser,loginUser,forgotPassword}