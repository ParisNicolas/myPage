const { Router } = require('express');
const path = require('path');
const router = Router();

const { verifyToken } = require('../middlewares/authJwt');
const { upload, allowedPath } = require('../config');
const { 
    getContent, 
    getDetails, 
    dowloadFile, 
    uploadFile, 
    deleteFile, 
    createFolder, 
    renameFile,
    seeFamilyCarpets
} = require('../controllers/storage.controler'); 


//Security to avoid routes outside the main path
router.param('path', (req, res, next, parameter)=>{
    const mainPath = path.join(allowedPath, req.params.userFolder)
    const fileRoute = path.join(mainPath, parameter || '');
    if(!fileRoute.startsWith(mainPath)){
        return res.status(403).json({message: 'Acceso restringido a esta ruta'});
    }
    next();
})

//Only for family authenticated
router.use(verifyToken('family'));

router.param('userFolder', (req, res, next, folder)=>{
  if(folder === 'shared') next();
  else if(req.roles.includes('admin')) next();
  else if(req.username.toLowerCase() === folder) next();
  else return res.status(401).json({message:'No tienes permiso para acceder a esta carpeta'})
})

router.get('/', (req, res) => res.redirect('/storage/files/'));

router.get('/files', seeFamilyCarpets);
router.get('/files/:userFolder/:path(*)?',getContent);
router.get('/details/:userFolder/:path(*)?', getDetails);
router.get('/dowload/:userFolder/:path(*)', dowloadFile);
router.post('/upload/:userFolder/:path(*)?',upload.single('file'), uploadFile);
router.delete('/delete/:userFolder/:path(*)', deleteFile);
router.post('/folder/:userFolder/:path(*)?', createFolder);
router.patch('/rename/:userFolder/:path(*)', renameFile);


module.exports = router;