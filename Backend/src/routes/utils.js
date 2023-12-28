const { Router } = require('express');
const router = Router();

router.get('/', (req, res)=>{
    const tools = ['debugger','adminPanel','remoteTerminal'];
    res.status(200).json({tools});
});
router.get('/debugger', (req, res)=>{});
router.get('/adminPanel', (req, res)=>{});

module.exports = router;