import { Router } from "express";
import {
  mediaRepository,
  createMediaUseCase,
  updateMediaUseCase,
  deleteMediaUseCase,
} from "../container";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { upload } from "../middleware/upload";

export const mediaRouter = Router();

mediaRouter.get("/", async (req, res) => {
  const query = req.query.q as string | undefined;
  const media = await mediaRepository.findAll(query);
  res.json(media);
});

mediaRouter.get("/:id", async (req, res) => {
  const id = req.params.id as string;
  const media = await mediaRepository.findById(id);

  if (!media) {
    return res.status(404).json({ message: "Media not found" });
  }

  res.json(media);
});

mediaRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    const {
      title,
      type,
      activity,
      status,
      progressTotal,
      progressUnit,
      description,
    } = req.body;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl || undefined;

    const media = await createMediaUseCase.execute({
      title,
      type,
      activity,
      status,
      progressTotal: progressTotal ? Number(progressTotal) : undefined,
      progressUnit,
      description: description || undefined,
      imageUrl,
    });

    res.json(media);
  }
);

mediaRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    const id = req.params.id as string;
    const {
      title,
      type,
      activity,
      status,
      progressTotal,
      progressUnit,
      description,
    } = req.body;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl || undefined;

    const media = await updateMediaUseCase.execute(id, {
      title,
      type,
      activity,
      status,
      progressTotal: progressTotal ? Number(progressTotal) : undefined,
      progressUnit,
      description: description || undefined,
      imageUrl,
    });

    res.json(media);
  }
);

mediaRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const id = req.params.id as string;
    await deleteMediaUseCase.execute(id);
    res.json({ message: "Deleted" });
  }
);
