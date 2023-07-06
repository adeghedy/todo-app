import express, { Express, Request, Response } from "express";
import { router as postRouter } from "./routes/postRoutes";
import { router as userRouter } from "./routes/userRoutes";
const cors = require("cors");

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

module.exports = app;
