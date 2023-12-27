const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Pls especify the username"],
    },
    password: {
        type: String,
        required: [true, "You can't get a user without password"],
    }
},
{
    timestamps: true
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return bcrypt.compare(password, receivedPassword);
}

const User = mongoose.model("Post", userSchema);

module.exports = User;
