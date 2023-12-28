const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { tryCatch, serverError } = require('../libs/manageErrors');

const { familyMembers } = require('../config');
const logger = require('../libs/logger');
logger.type = 'AUTH';

const SECRET = process.env.SECRET;


const verifyToken = (roleNeeded = 'guest') => tryCatch(async (req, res, next) => {
    //Get header with token and take out the word 'bearer'
    const authHeader = req.headers["authorization"] || '';
    const token = authHeader.startsWith('Bearer') ? authHeader.split(' ')[1]:authHeader;

    //No token provided
    if(!token) return res.status(403).json({message: "Necesitas proporcionar un token de acceso"});

    //Decode and verify token
    let decoded;
    try{
        decoded = jwt.verify(token, SECRET);
    }catch(e){
        throw new serverError('Error al verificar el token: '+e, 401)
    }
    
    //Search if user exists
    const username = decoded.username.toLowerCase();
    if(!(familyMembers.includes(username) || process.env.ADMIN === username)){
        if(decoded.id !== 0){
            const user = await User.findById(decoded.id, {password:false});
            if(!user) return res.status(403).json({message: "Usuario no encontrado para token"});
        }else{
            throw new serverError('Error en la consistencia del token, id=0 pero no es un familiar', 500);
        }
    }
    
    //Check if roles are enough to access
    if(decoded.roles.includes(roleNeeded)){
        req.username = decoded.username;
        req.roles = decoded.roles;
        next();
    }else{
        return res.status(403).json({message: "No tienes permiso para acceder a esta ruta"});
    }
}, 'Fallo en la autenticacion');


const checkFamilyPrivileges = async (req, res, next) => {
    const {username, password} = req.body;
    req.roles = ['guest'];
    
    if(username.toLowerCase() === process.env.ADMIN){
        if(await User.comparePassword(password, process.env.ADMIN_PASSWORD)){
            req.roles.push('admin');
            logger.info('El admin entro', {req});
        }else{
            return res.status(401).json({message: "Contraseña incorrecta para: "+username});
        }
    }

    if(familyMembers.includes(username.toLowerCase())){
        req.roles.push('family');
        logger.info('Un familiar entro', {req});
    }

    next();
}


const checkLegalityOfData = (req, res, next) => {
    const {username, password} = req.body;

    if(username.length > 20) return res.status(400).json({message:"El nombre no puede ser mayor que 20 caracteres"});

    if(password.length < 4) return res.status(400).json({message:"La contraseña no puede ser menor que 4 caracteres"});
    if(password.length > 20) return res.status(400).json({message:"La contraseña no puede ser mayor que 20 caracteres"});
    if(password.includes(' ')) return res.status(400).json({message:"La contraseña no puede contener espacios"});

    next();
}

const checkDuplicateUser = async (req, res, next) => {
    const {username} = req.body;
    
    const user = await User.findOne({username});

    if(familyMembers.includes(username.toLowerCase()) || user){
        return res.status(400).json({message: 'El usuario ya existe'});
    }

    next();
}

module.exports = {
    verifyToken, 
    checkDuplicateUser, 
    checkLegalityOfData,
    checkFamilyPrivileges
};