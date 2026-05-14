import { Router } from "express";

import { registerUser } from "../use-cases/register-user";
import { loginUser } from "../use-cases/login-user";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.json(user);
  } catch {
    res.status(400).json({
      message: "Could not register user.",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body);

    res.json({ token });
  } catch {
    res.status(401).json({
      message: "Invalid credentials.",
    });
  }
});