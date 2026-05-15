import { Router } from "express";
import { prisma } from "../prisma/client";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { upload } from "../middleware/upload";

export const userRouter = Router();

userRouter.get("/", authMiddleware, adminMiddleware, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  });

  res.json(users);
});

userRouter.get("/me", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  });

  res.json(user);
});

userRouter.get("/me/media", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;

  const userMedias = await prisma.userMedia.findMany({
    where: { userId },
    include: { media: true },
  });

  res.json(userMedias);
});

userRouter.post("/me/media/:mediaId", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const mediaId = req.params.mediaId as string;

  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    return res.status(404).json({ message: "Media not found" });
  }

  try {
    const userMedia = await prisma.userMedia.create({
      data: {
        userId,
        mediaId,
        progressCurrent: 0,
      },
      include: { media: true },
    });

    res.status(201).json(userMedia);
  } catch {
    res.status(409).json({ message: "Media already in your list" });
  }
});

userRouter.patch("/me/media/:userMediaId/progress", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const userMediaId = req.params.userMediaId as string;
  const { action, value } = req.body as { action: "increment" | "decrement" | "set"; value?: number };

  const userMedia = await prisma.userMedia.findUnique({
    where: { id: userMediaId },
    include: { media: true },
  });

  if (!userMedia || userMedia.userId !== userId) {
    return res.status(404).json({ message: "Media not found in your list" });
  }

  const current = userMedia.progressCurrent;
  const total = userMedia.media.progressTotal ?? Infinity;

  let newCurrent = current;
  if (action === "increment" && current < total) {
    newCurrent = current + 1;
  } else if (action === "decrement" && current > 0) {
    newCurrent = current - 1;
  } else if (action === "set" && typeof value === "number") {
    newCurrent = Math.max(0, Math.min(value, total));
  }

  const updated = await prisma.userMedia.update({
    where: { id: userMediaId },
    data: { progressCurrent: newCurrent },
    include: { media: true },
  });

  res.json(updated);
});

userRouter.delete("/me/media/:userMediaId", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const userMediaId = req.params.userMediaId as string;

  const userMedia = await prisma.userMedia.findUnique({
    where: { id: userMediaId },
  });

  if (!userMedia || userMedia.userId !== userId) {
    return res.status(404).json({ message: "Media not found in your list" });
  }

  await prisma.userMedia.delete({
    where: { id: userMediaId },
  });

  res.json({ message: "Removed from your list" });
});

userRouter.put(
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    const userId = req.user!.id as string;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    res.json(user);
  }
);

userRouter.patch("/me/username", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const { username } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ message: "Username is required" });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { username: username.trim() },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  });

  res.json(user);
});
