const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;
const userSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

userSchema.statics.signup = async function (email, name, password) {

    if (!email || !password || !name) {
        throw Error('All fields must be filled')
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }

    const user = await this.findOne({ email });
    if (user) {
        throw Error('Email is already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await this.create({ email, name, password: hash });
    return newUser;

}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }


    const matchUser = await this.findOne({ email });
    if (!matchUser) {
        throw Error('Incorrect email')
    }

    const matchPassword = await bcrypt.compare(password, matchUser.password);
    if (!matchPassword) {
        throw Error('Incorrect password')
    }
    return matchUser;
}
userSchema.statics.forgotPassword = async function (email, password) {
    try {
        if (!email || !password) {
            throw Error('All fields must be filled')
        }
    
        if (!validator.isEmail(email)) {
            throw Error('Email is not valid');
        }
    
        if (!validator.isStrongPassword(password)) {
            throw Error('Password is not strong enough');
        }
    
        const user = await this.findOne({ email });
        if (!user) {
            throw Error('Email is not found !');
        }
    
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user.password = hash;
        user.save();
        return "Password is changed successfully.Please try to login with new one";
    } catch (error) {
        throw Error(error.message);
    }
}
module.exports = mongoose.model('User', userSchema)