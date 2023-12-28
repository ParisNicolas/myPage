const mongoose = require("mongoose");
const path = require('path');
const jimp = require('jimp');
const { serverError } = require('../libs/manageErrors');
const { thumbnailPath } = require("../config");

const thumbnailSchema = new mongoose.Schema({
    originalPath: {
        type: String,
        required: [true, 'OriginalPath of image is required']
    },
    thumbnailPath: {
        type: String,
        required: [true, 'ThumbnailPath isn\'t especified']
    },
    thumbnailName: {
        type: String,
        required: [true, 'ThumbnailName isn\'t especified']
    }
});


thumbnailSchema.statics.getThumbnail = async (file, originalname) => {
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

const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);

module.exports = Thumbnail;