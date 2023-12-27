const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
        .then(()=>console.log("Connected to database"))
        .catch((err)=>console.log("Error to connect to database: ", err))