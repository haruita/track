import { expect, test, describe, vi, beforeEach } from "vitest";

vi.mock("../prisma/client", () => ({
  prisma: {
    media: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "../prisma/client";
import { createMedia, getMedia, updateMedia, deleteMedia } from "./media";

describe("media use-cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createMedia", () => {
    test("creates media with provided data", async () => {
      const mediaData = {
        title: "Test Anime",
        type: "anime",
        activity: "watch",
        status: "planned",
        progressTotal: 24,
        progressUnit: "episode",
      };

      const created = { id: "media-1", ...mediaData };
      vi.mocked(prisma.media.create).mockResolvedValue(created);

      const result = await createMedia(mediaData);

      expect(prisma.media.create).toHaveBeenCalledWith({
        data: mediaData,
      });
      expect(result).toEqual(created);
    });
  });

  describe("getMedia", () => {
    test("returns all media entries", async () => {
      const mediaList = [
        { id: "1", title: "Anime 1", type: "anime" },
        { id: "2", title: "Game 1", type: "game" },
      ];

      vi.mocked(prisma.media.findMany).mockResolvedValue(mediaList as any);

      const result = await getMedia();

      expect(prisma.media.findMany).toHaveBeenCalled();
      expect(result).toEqual(mediaList);
    });

    test("returns empty array when no media exists", async () => {
      vi.mocked(prisma.media.findMany).mockResolvedValue([]);

      const result = await getMedia();

      expect(result).toEqual([]);
    });
  });

  describe("updateMedia", () => {
    test("updates media by id", async () => {
      const updateData = { title: "Updated Title", status: "completed" };
      const updated = { id: "media-1", ...updateData };

      vi.mocked(prisma.media.update).mockResolvedValue(updated as any);

      const result = await updateMedia("media-1", updateData);

      expect(prisma.media.update).toHaveBeenCalledWith({
        where: { id: "media-1" },
        data: updateData,
      });
      expect(result).toEqual(updated);
    });
  });

  describe("deleteMedia", () => {
    test("deletes media by id", async () => {
      const deleted = { id: "media-1", title: "Deleted Media" };

      vi.mocked(prisma.media.delete).mockResolvedValue(deleted as any);

      const result = await deleteMedia("media-1");

      expect(prisma.media.delete).toHaveBeenCalledWith({
        where: { id: "media-1" },
      });
      expect(result).toEqual(deleted);
    });
  });
});
