import { expect, test, describe, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../prisma/client", () => ({
  prisma: {
    media: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "../prisma/client";
import { app } from "../app";

describe("media routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /media", () => {
    test("returns all media", async () => {
      const mediaList = [
        { id: "1", title: "Anime 1", type: "anime" },
        { id: "2", title: "Game 1", type: "game" },
      ];

      vi.mocked(prisma.media.findMany).mockResolvedValue(mediaList as any);

      const response = await request(app).get("/media");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mediaList);
    });

    test("searches media by query parameter", async () => {
      const mediaList = [{ id: "1", title: "Steins;Gate", type: "anime" }];

      vi.mocked(prisma.media.findMany).mockResolvedValue(mediaList as any);

      const response = await request(app).get("/media?q=Steins");

      expect(response.status).toBe(200);
      expect(prisma.media.findMany).toHaveBeenCalledWith({
        where: { title: { contains: "Steins" } },
      });
    });

    test("returns empty array when no media matches", async () => {
      vi.mocked(prisma.media.findMany).mockResolvedValue([]);

      const response = await request(app).get("/media?q=NonExistent");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /media/:id", () => {
    test("returns media by id", async () => {
      const media = {
        id: "media-1",
        title: "Test Media",
        type: "anime",
        activity: "watch",
        status: "watching",
        progressTotal: 24,
        progressUnit: "episode",
      };

      vi.mocked(prisma.media.findUnique).mockResolvedValue(media as any);

      const response = await request(app).get("/media/media-1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(media);
    });

    test("returns 404 when media not found", async () => {
      vi.mocked(prisma.media.findUnique).mockResolvedValue(null);

      const response = await request(app).get("/media/nonexistent");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Media not found" });
    });
  });
});
