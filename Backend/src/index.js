const express = require("express");

require("dotenv").config();
require('./config');
require('./database');

const app = require('./app');


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log("Server runing on port", PORT));
