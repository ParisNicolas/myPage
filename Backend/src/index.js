const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
require('./config');

const app = require('./app');
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
        .then(()=>console.log("Connected to database"))
        .catch((err)=>console.log("Error to connect to database: ", err))

app.listen(PORT, ()=> console.log("Server runing on port", PORT));