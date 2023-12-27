const { Router } = require('express');
const { signIn, signUp } = require('../controllers/auth.controller');

const router = Router();

router.post('/signUp', signIn);
router.post('/signIn', signUp);

module.exports = router;