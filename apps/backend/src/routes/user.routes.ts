import { Router } from "express";
import { prisma } from "../prisma/client";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRouter =
  Router();

userRouter.get(
  "/me",

  authMiddleware,

  async (req, res) => {
    const userId =
      req.user!.id;

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

    res.json(user);
  }
);