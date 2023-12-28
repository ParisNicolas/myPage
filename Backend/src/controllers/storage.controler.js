const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const mime = require('mime-types');

const { allowedPath, guestFolder, familyFolders } = require('../config');
const Thumbnail = require('../models/Thumbnail');
const { tryCatch, serverError } = require('../libs/manageErrors');

const logger = require('../libs/logger');
logger.type = 'STORAGE';


//Get basename of a mime-type from file
function getMimeType(file){
    const mimeType = mime.lookup(file);
    if (mimeType) return mimeType.split('/')[0];
    else return 'unknown';
}

exports.seeFamilyCarpets = (req, res) => {
    const elements = [
        path.basename(guestFolder), 
        ...familyFolders.map((c)=>path.basename(c))
    ];
    res.status(200).json({files: [], folders: elements});
}


//See folders or file content
exports.getContent = tryCatch(async (req, res) => {

    //Get path and stats
    const fileRoute = path.join(allowedPath, req.params.userFolder, req.params.path || '/');
    const stats = await fs.stat(fileRoute);

    //Send file or see folder content
    if (stats.isFile()) {
        res.sendFile(fileRoute);
    }
    else if(stats.isDirectory()) {
        let elements = {"files":[],"folders":[]};
        
        const files = await fs.readdir(fileRoute, {withFileTypes: true});
        
        //Push folder and files with basic info
        for(const f of files) {
            if(f.isDirectory()){
                elements.folders.push(f.name)
            }
            else{
                let file = {
                    name: f.name, 
                    type: getMimeType(f.name), //Se podria usar una BD talvez            
                }

                //Obtain image thumnailName 
                if(file.type === "image"){
                    const document = await Thumbnail.findOne({originalPath: path.join(fileRoute, f.name)}, "thumbnailName");
                    if(document) file.thumbnail = document.thumbnailName;
                    else {
                        logger.warn('Miniatura no encontrada en BD para: '+f.name, {req});
                        file.thumbnail = 'unknown'
                    }
                }

                elements.files.push(file)
            }
        }  
        res.json(elements);
    }
}, 'Error al obtener contenido de la ruta');




//Get info of a file
//Faltaria tal vez mostrar el tamaño en kb o mb y talvez mostrar metadatos de imagenes
exports.getDetails = tryCatch(async (req, res) => {

    const fileRoute = path.join(allowedPath, req.params.userFolder, req.params.path || '');
    const stats = await fs.stat(fileRoute);

    const metadata = {
        name: path.basename(fileRoute),
        path: fileRoute,
        ext: stats.isDirectory() ? 'directory':path.extname(fileRoute),
        createDate: stats.birthtime,
        modificationDate: stats.mtime,
        sizeKB: stats.size/1024,
    };

    res.json(metadata);

}, 'Error al obtener información sobre la ruta');




//Dowload Files
exports.dowloadFile = tryCatch(async (req, res) => {

    const fileRoute = path.join(allowedPath, req.params.userFolder, req.params.path || '');
    const stats = await fs.stat(fileRoute);

    if(stats.isFile()){
        res.download(fileRoute);
    }else{
        const archive = archiver('zip');
        res.attachment(path.basename(fileRoute)+'.zip');
        archive.pipe(res);
        archive.directory(fileRoute, false);
        archive.finalize();
    }

}, 'Error al descargar');




//Upload Files
exports.uploadFile = tryCatch(async (req, res) => {
    logger.created('Nuevo archivo: '+req.file.filename, {req});

    //Create a thumnail and save it in database
    if(req.file.mimetype.startsWith('image')){
        newPath = await Thumbnail.getThumbnail(req.file.path, req.file.filename); //Create thumbnail
        logger.created('Miniatura creada: ' + newPath.name);

        //Save thumbnail in database
        const newThumbnail = new Thumbnail({
            originalPath: req.file.path, 
            thumbnailPath: newPath.dest, 
            thumbnailName: newPath.name
        });

        const id = (await newThumbnail.save())._id;
        logger.created('Nuevo documento en mongoDB: '+id);
    }
    
    res.status(201).json({message: 'Archivo subido exitosamente'});
}, 'Error al cargar archivo');



//Delete Files
exports.deleteFile = tryCatch(async (req, res) => {
    const fileRoute = path.join(allowedPath, req.params.userFolder, req.params.path || '/');
    const stats = await fs.stat(fileRoute);

    if(stats.isFile()){
        if(getMimeType(fileRoute) === 'image'){
            const image = await Thumbnail.findOneAndDelete({originalPath: fileRoute});

            if(image){
                logger.removed(`Borrando ${image.thumbnailName} para ${req.params.path} de la base de datos`, {req});

                try{
                    fs.unlink(image.thumbnailPath);
                }catch(err){
                    throw new serverError('Error al eliminar la miniatura: '+ err, 500);
                }

            }else{
                logger.warn(`La imagen ${req.params.path} no se encontro en la base de datos`);
            }
        }
        try{
            fs.unlink(fileRoute);
            logger.removed('Archivo borrado: '+ req.params.path);
            res.status(200).json({message:'Archivo borrado exitosamente'});
        }catch(err){
            throw new serverError('Error al eliminar el archivo'+ err, 500);
        }
    }
    else{
         res.status(503).json({message: 'Eliminar carpetas aun no disponible'})
    }
}, 'Error al borrar el archivo');



//Create Folder
exports.createFolder = tryCatch(async (req, res) => {
    const folderRoute = path.join(allowedPath, req.params.userFolder, req.params.path || '/');
    
    await fs.mkdir(folderRoute);
    logger.created('Nueva carpeta: '+req.params.path, {req});
    res.status(201).json({message: 'Carpeta creada'});

}, 'Error al crear la carpeta');



//Rename Files
exports.renameFile = tryCatch(async (req, res) => {
    const fileRoute = path.join(allowedPath, req.params.userFolder, req.params.path || '/');
    let newPath;

    //Check file extension
    const regex = /\.[^.]+$/;
    if(regex.test(req.body.newName)){
        if(path.extname(fileRoute) != path.extname(req.body.newName)){
            return res.status(400).json({message: "You can't change extension of a file"});
        }
        newPath = path.join(path.dirname(fileRoute), req.body.newName);
    }else{
        newPath = path.join(path.dirname(fileRoute), req.body.newName + path.extname(fileRoute));
    }

    //Update path in database
    if(getMimeType(req.params.path) === 'image'){
        //Falta comprovar que todo funcione aca
        const updated = await Thumbnail.updateOne({originalPath: fileRoute}, {originalPath: newPath});
        if(!updated.matchedCount){
            logger.warn('Miniatura no encontrada en BD para: '+req.params.path);
        }
    }

    //rename file
    await fs.rename(fileRoute, newPath);
    logger.modified(`Archivo renombrado: ${req.params.path} --> ${req.body.newName}`, {req});
    res.status(200).json({message: 'Archivo renombrado'});

}, 'Error al renombrar');