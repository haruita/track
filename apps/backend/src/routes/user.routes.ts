import { Router } from "express";
import {
  userRepository,
  userMediaRepository,
  addMediaToListUseCase,
  updateMediaProgressUseCase,
  removeMediaFromListUseCase,
} from "../container";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { upload } from "../middleware/upload";

export const userRouter = Router();

userRouter.get("/", authMiddleware, adminMiddleware, async (_req, res) => {
  const users = await userRepository.list();
  const sanitized = users.map((u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
  }));
  res.json(sanitized);
});

userRouter.get("/me", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const user = await userRepository.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });
});

userRouter.get("/me/media", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const userMedias = await userMediaRepository.findByUserId(userId);
  res.json(userMedias);
});

userRouter.post("/me/media/:mediaId", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const mediaId = req.params.mediaId as string;

  try {
    const userMedia = await addMediaToListUseCase.execute(userId, mediaId);
    res.status(201).json(userMedia);
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Media not found") {
      return res.status(404).json({ message });
    }
    res.status(409).json({ message });
  }
});

userRouter.patch(
  "/me/media/:userMediaId/progress",
  authMiddleware,
  async (req, res) => {
    const userId = req.user!.id as string;
    const userMediaId = req.params.userMediaId as string;
    const { action, value } = req.body as {
      action: "increment" | "decrement" | "set";
      value?: number;
    };

    const userMedia = await userMediaRepository.findById(userMediaId);
    if (!userMedia || userMedia.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Media not found in your list" });
    }

    const maxProgress = userMedia.media.progressTotal ?? Infinity;

    const progressAction =
      action === "set"
        ? { action: "set" as const, value: value ?? 0 }
        : { action: action as "increment" | "decrement" };

    try {
      const updated = await updateMediaProgressUseCase.execute(
        userMediaId,
        userId,
        progressAction,
        maxProgress
      );
      res.json(updated);
    } catch {
      res.status(404).json({ message: "Media not found in your list" });
    }
  }
);

userRouter.delete("/me/media/:userMediaId", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const userMediaId = req.params.userMediaId as string;

  try {
    await removeMediaFromListUseCase.execute(userMediaId, userId);
    res.json({ message: "Removed from your list" });
  } catch {
    res.status(404).json({ message: "Media not found in your list" });
  }
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
    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updated = await userRepository.create({
      ...user,
      avatarUrl,
    } as any);

    res.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      avatarUrl: updated.avatarUrl,
    });
  }
);

userRouter.patch("/me/username", authMiddleware, async (req, res) => {
  const userId = req.user!.id as string;
  const { username } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ message: "Username is required" });
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updated = await userRepository.create({
    ...user,
    username: username.trim(),
  } as any);

  res.json({
    id: updated.id,
    username: updated.username,
    email: updated.email,
    role: updated.role,
    avatarUrl: updated.avatarUrl,
  });
});
