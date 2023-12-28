const multer = require('multer');
const increment = require('add-filename-increment');
const path = require("path");
const { existsSync, mkdirSync } = require("fs");

///--------Paths for data-------///
global.storagePath = process.env.STORAGE;
const familyMembers = process.env.FAMILY.split(',');
const allowedPath = path.join(global.storagePath, '/storage');
const thumbnailPath = path.join(global.storagePath, '/thumbnails');
const logPath = path.join(global.storagePath, '/logs');

const guestFolder = path.join(allowedPath, '/shared')
const familyFolders = familyMembers.map((memberName) => path.join(allowedPath, memberName));
//----------------------------------------------------------//


//------Settings to store files on disk-------//
const storage = multer.diskStorage({
   //Route where the file will be saved
   destination: (req, file, cb) => {
     cb(null, path.join(allowedPath, req.params.path));
   },
   //Name with which it will be saved
   filename: (req, file, cb) => {
     const pathFile = path.join(allowedPath, req.params.userFolder, req.params.path, file.originalname);
     cb(null, increment.file({path: pathFile}, {platform: 'win32', fs: true}).base);
   }
});
const upload = multer({storage: storage});
//------------------------------------//


//Check if all routes exists, if not creates them
try {
   const routes = [
      global.storagePath, 
      allowedPath, 
      thumbnailPath,
      logPath,
      guestFolder,
      ...familyFolders
   ];
   routes.map(route => existsSync(route) ? 0:mkdirSync(route));
 
} catch (error) {
   console.error('Error al verificar/crear la ruta de almacenamiento:', error);
   process.exit(1); // Salir del proceso en caso de error
}

module.exports = {
   familyMembers, 
   allowedPath, 
   thumbnailPath, 
   logPath,
   upload,
   familyFolders,
   guestFolder
};