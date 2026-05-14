import { Router } from "express";

import {
  createMedia,
  getMedia,
  updateMedia,
  deleteMedia,
} from "../use-cases/media";

import { authMiddleware } from "../middleware/auth.middleware";

export const mediaRouter = Router();

mediaRouter.use(authMiddleware);

mediaRouter.get("/media", async (_, res) => {
  const media = await getMedia();
  res.json(media);
});

mediaRouter.post("/media", async (req, res) => {
  const media = await createMedia(req.body);
  res.json(media);
});

mediaRouter.put("/media/:id", async (req, res) => {
  const media = await updateMedia(
    req.params.id,
    req.body
  );
  res.json(media);
});

mediaRouter.delete(
  "/media/:id",
  async (req, res) => {
    const media = await deleteMedia(
      req.params.id
    );
    res.json(media);
  }
);