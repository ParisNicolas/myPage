const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

//Modules
const errorHandler = require("./middlewares/errorHandler");
const storageRouter = require("./routes/storage");
const authRouter = require("./routes/auth");
const utilityRouter = require("./routes/utils");

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false })); //Para parametros "?nombre=sad&casa=23"
app.use(express.json());
app.use(cors()); //Talvez inecesario
app.use((req,res,next)=>{console.log();next()}); //Print enter in console

//Routes
app.get("/", (req, res)=>res.send("Ok"))
app.use("/storage", storageRouter);
app.use("/", authRouter);
app.use("/utils", utilityRouter)

//Error
app.use(errorHandler);


module.exports = app;