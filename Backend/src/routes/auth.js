const { Router } = require('express');
const { signIn, signUp, deleteUser } = require('../controllers/auth.controller');
const { 
    checkDuplicateUser, 
    verifyToken, 
    checkLegalityOfData, 
    checkFamilyPrivileges 
} = require('../middlewares/authJwt');

const router = Router();

router.post('/signUp', [checkLegalityOfData, checkDuplicateUser], signUp);
router.post('/signIn', checkFamilyPrivileges, signIn);
router.delete('/deleteUser/:username', verifyToken('admin'), deleteUser);
router.get('/check', verifyToken(), (req, res)=>{
    res.status(200).json({message: 'Felicitaciones has pasado el chequeo'})
});

module.exports = router;