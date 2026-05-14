import express from "express";
import cors from "cors";

import { authRouter } from "./routes/auth.routes";
import { mediaRouter } from "./routes/media.routes";
import { userRouter } from "./routes/user.routes";

export const app = express();

app.use(cors());

app.use(express.json());

app.use(authRouter);
app.use(mediaRouter);
app.use(userRouter);