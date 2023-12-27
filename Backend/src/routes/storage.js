const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const increment = require('add-filename-increment');
const router = Router();

const allowedPath = path.join(global.storagePath, '/storage');

const { 
    getContent, 
    getDetails, 
    dowloadFile, 
    uploadFile, 
    deleteFile, 
    createFolder, 
    renameFile 
} = require('../controllers/storage.controler'); 


// Settings to store files on disk
const storage = multer.diskStorage({
    //Route where the file will be saved
    destination: (req, file, cb) => {
      cb(null, path.join(allowedPath, req.params.path));
    },
    //Name with which it will be saved
    filename: (req, file, cb) => {
      const pathFile = path.join(allowedPath, req.params.path, file.originalname);
      cb(null, increment.file({path: pathFile}, {platform: 'win32', fs: true}).base);
    }
});
const upload = multer({storage: storage});


//Security to avoid routes outside the main path
router.param('path', (req, res, next, parameter)=>{
    const fileRoute = path.join(allowedPath, parameter || '');
    if(!fileRoute.startsWith(allowedPath)){
        return res.status(403).send('Acceso no autorizado a esta ruta.');
    }
    next();
})

router.get('/', (req, res) => res.redirect('/storage/files/'));

//See folders or file content
router.get('/files/:path(*)?', getContent);

//Get info of a file
router.get('/details/:path(*)?', getDetails);

//Dowload Files
router.get('/dowload/:path(*)', dowloadFile);

//Upload Files
router.post('/upload/:path(*)?',upload.single('file'), uploadFile);

//Delete Files
router.delete('/delete/:path(*)', deleteFile);

//Create Folder
router.post('/folder/:path(*)?', createFolder);

//Rename Files
router.patch('/rename/:path(*)', renameFile);


module.exports = router;