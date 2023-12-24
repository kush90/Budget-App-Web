const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = async(req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization) {
        return res.status(401).json({'error':'Authorization tokern required'})
    }
    const token = authorization.split(' ')[1]
    try {
        const check = jwt.verify(token,process.env.SECRET);
        const user = await User.findById(check._id).select('_id');
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({'error': 'Request is not authorized'})
    }
}
module.exports = auth;