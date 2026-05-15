import { Router } from "express";
import { prisma } from "../prisma/client";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

export const mediaRouter =
  Router();

// Public routes

mediaRouter.get(
  "/",

  async (_req, res) => {
    const media =
      await prisma.media.findMany();

    res.json(media);
  }
);

mediaRouter.get(
  "/:id",

  async (req, res) => {
    const id =
      req.params.id as string;

    const media =
      await prisma.media.findUnique({
        where: {
          id,
        },
      });

    if (!media) {
      return res
        .status(404)
        .json({
          message:
            "Media not found",
        });
    }

    res.json(media);
  }
);

// Admin routes

mediaRouter.post(
  "/",

  authMiddleware,
  adminMiddleware,

  async (req, res) => {
    const media =
      await prisma.media.create({
        data: req.body,
      });

    res.json(media);
  }
);

mediaRouter.put(
  "/:id",

  authMiddleware,
  adminMiddleware,

  async (req, res) => {
    const id =
      req.params.id as string;

    const media =
      await prisma.media.update({
        where: {
          id,
        },

        data: req.body,
      });

    res.json(media);
  }
);

mediaRouter.delete(
  "/:id",

  authMiddleware,
  adminMiddleware,

  async (req, res) => {
    const id =
      req.params.id as string;

    await prisma.media.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Deleted",
    });
  }
);