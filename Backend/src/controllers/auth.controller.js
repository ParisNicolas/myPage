const jwt = require('jsonwebtoken');

const User = require("../models/user");
const logger = require('../libs/logger');
const SECRET = process.env.SECRET;
const tokenExpiresTime = 1036800; //12 days

exports.signUp = async (req, res) => {
    const {username, password} = req.body;

    //Comprovar si el usuario ya existe

    const newUser = new User({
        username,
        password: User.encryptPassword(password)
    });
    const document = await newUser.save();

    //Obtener secreto de archivo config o env
    const token = jwt.sign({id: document._id}, SECRET, {
        expiresIn: tokenExpiresTime //12 days
    })

    logger.auth(`Nuevo usuario registrado: ${document.username}`);
    res.status(200).json({token});
};

exports.signIn = async (req, res) => {
    const {username, password} = req.body;

    const userFound = await User.findOne({username})
    if(!userFound) return res.status(400).json({message: "User not found"});

    const matchPassword = await User.comparePassword(password, userFound.password);
    if(!matchPassword) return res.status(400).json({message: "Invalid password"});

    const token = jwt.sign({id: userFound._id}, SECRET, {
        expiresIn: tokenExpiresTime //12 days
    })

    console.log(userFound);

    res.status(200).json({token: ''});
};
