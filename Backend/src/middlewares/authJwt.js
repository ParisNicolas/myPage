const jwt = require('jsonwebtoken');
const User = require("../models/user");
const SECRET = process.env.SECRET;

const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"];

    console.log(token);

    if(!token) return res.status(403).json({message: "You need to provide an authorization token"});

    const decoded = jwt.verify(token, SECRET);

    //password false para no devolverlo?
    const user = await User.findById(decoded.id, {password:false});
    if(!user) res.status(403).json({message: "User not found for your token"});

    next();
}

module.exports = verifyToken;