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

describe("GET /media", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return all media with status 200", async () => {
    const mediaList = [
      { id: "1", title: "Anime 1", type: "anime" },
      { id: "2", title: "Game 1", type: "game" },
    ];

    vi.mocked(prisma.media.findMany).mockResolvedValue(mediaList as any);

    const response = await request(app).get("/media");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mediaList);
  });

  test("should return an empty array when no media exists", async () => {
    vi.mocked(prisma.media.findMany).mockResolvedValue([]);

    const response = await request(app).get("/media");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("should filter media by title when query param q is provided", async () => {
    const mediaList = [{ id: "1", title: "Steins;Gate", type: "anime" }];

    vi.mocked(prisma.media.findMany).mockResolvedValue(mediaList as any);

    const response = await request(app).get("/media?q=Steins");

    expect(response.status).toBe(200);
    expect(prisma.media.findMany).toHaveBeenCalledWith({
      where: { title: { contains: "Steins" } },
    });
  });

  test("should return empty array when no media matches the search query", async () => {
    vi.mocked(prisma.media.findMany).mockResolvedValue([]);

    const response = await request(app).get("/media?q=NonExistentTitle");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("GET /media/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return media by id with status 200", async () => {
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

  test("should return 404 with error message when media is not found", async () => {
    vi.mocked(prisma.media.findUnique).mockResolvedValue(null);

    const response = await request(app).get("/media/nonexistent-id");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Media not found" });
  });
});
