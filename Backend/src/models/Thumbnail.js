const mongoose = require("mongoose");

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

const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);

module.exports = Thumbnail;