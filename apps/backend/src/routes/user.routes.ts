import { Router } from "express";

import { prisma } from "../prisma/client";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

export const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get(
  "/users",
  adminMiddleware,
  async (_, res) => {
    const users =
      await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });
    res.json(users);
  }
);