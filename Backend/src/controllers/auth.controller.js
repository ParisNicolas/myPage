const jwt = require('jsonwebtoken');

const User = require("../models/user");
const logger = require('../libs/logger');
logger.type = 'AUTH';

const SECRET = process.env.SECRET;
const tokenExpiresTime = 60*60*24 * 12; //12 days

exports.signUp = async (req, res) => {
    const {username, password} = req.body;

    const newUser = new User({
        username,
        password: await User.encryptPassword(password)
    });
    const document = await newUser.save();

    const token = jwt.sign({id: document._id, roles:['guest'], username}, SECRET, {
        expiresIn: tokenExpiresTime
    })

    logger.auth(`Nuevo usuario registrado: ${username}`, {req});
    res.status(200).json({token});
};

exports.signIn = async (req, res) => {
    const {username, password} = req.body;
    let userFound = {_id: 0};

    //if not enough privileges check database for guests
    if(req.roles.length === 1){
        userFound = await User.findOne({username});
        if(!userFound) return res.status(400).json({message: "Usuario no encontrado"});

        const matchPassword = await User.comparePassword(password, userFound.password);
        if(!matchPassword) return res.status(400).json({message: "Contraseña incorrecta"});
    }

    const token = jwt.sign({id: userFound._id, roles: req.roles, username}, SECRET, {
        expiresIn: tokenExpiresTime
    })

    logger.auth(`Usuario logeado: ${username}`, {req});
    console.log(userFound, req.roles);
    
    res.status(200).json({token, username, roles: req.roles});
};

exports.deleteUser = async (req, res) => {
    const { username }  = req.params;

    const userFound = await User.findOneAndDelete({username});
    if(!userFound) return res.status(400).json({message: "Usuario no encontrado"});

    logger.auth(`Usuario eliminado: ${username}`, {req});
    res.status(200).json({message: `Usuario ${username} eliminado`})
}