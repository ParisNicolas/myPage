import express from "express"
import cors from "cors"
import path from "path"
import morgan from "morgan"
import router from "./routes/routes"

const app = express();

app.use(cors())
app.use(express.json())
app.use("/", myRouter);

module.exports = app;
