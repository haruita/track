import { Router } from "express";
import { registerUserUseCase, loginUserUseCase } from "../container";
import { generateToken } from "../auth/jwt";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const user = await registerUserUseCase.execute(req.body);
    res.json(user);
  } catch {
    res.status(400).json({ message: "Could not register user." });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const user = await loginUserUseCase.execute(req.body);
    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token });
  } catch {
    res.status(401).json({ message: "Invalid credentials." });
  }
});
