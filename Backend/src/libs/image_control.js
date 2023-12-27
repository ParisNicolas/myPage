const { serverError } = require('../../libs/manageErrors');
const mime = require('mime-types');
const path = require('path');
const jimp = require('jimp');

const thumbnailPath = path.join(global.storagePath, '/thumbnails');


function getMimeType(file){
    const mimeType = mime.lookup(file);
    if (mimeType) return mimeType.split('/')[0];
    else return 'unknown';
}

async function getThumbnail(file, originalname) {
    const newName = `thumb_${Date.now()}-${Math.round(Math.random() * 1E3)}${path.extname(originalname)}`;
    const dest = path.join(thumbnailPath, newName);
    try {
        // Cargar la imagen usando Jimp
        const image = await jimp.read(file);

        // Redimensionar la imagen al tamaño especificado
        image.resize(100, 100);
    
        // Guardar la miniatura en la ruta especificada
        await image.writeAsync(dest);

        return {dest: dest, name: newName}
    } catch (error) {
        throw new serverError('Error al procesar la imagen: '+error, 500);
    }
}

module.exports = {
    getMimeType,
    getThumbnail
}