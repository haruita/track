import express from "express";
import cors from "cors";
import { mediaRouter } from "./routes/media.routes";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/media", mediaRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);