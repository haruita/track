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

describe("createMedia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should create media with the provided data and return it", async () => {
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

    expect(prisma.media.create).toHaveBeenCalledWith({ data: mediaData });
    expect(result).toEqual(created);
  });

  test("should propagate error when prisma create fails", async () => {
    vi.mocked(prisma.media.create).mockRejectedValue(
      new Error("Field `title` is required")
    );

    await expect(
      createMedia({ title: "", type: "anime" })
    ).rejects.toThrow("Field `title` is required");
  });
});

describe("getMedia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return all media entries from the database", async () => {
    const mediaList = [
      { id: "1", title: "Anime 1", type: "anime" },
      { id: "2", title: "Game 1", type: "game" },
    ];

    vi.mocked(prisma.media.findMany).mockResolvedValue(mediaList as any);

    const result = await getMedia();

    expect(prisma.media.findMany).toHaveBeenCalled();
    expect(result).toEqual(mediaList);
  });

  test("should return an empty array when no media exists", async () => {
    vi.mocked(prisma.media.findMany).mockResolvedValue([]);

    const result = await getMedia();

    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("updateMedia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should update media by id with the provided data", async () => {
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

  test("should throw when updating a non-existent media", async () => {
    vi.mocked(prisma.media.update).mockRejectedValue(
      new Error("Record to update not found.")
    );

    await expect(
      updateMedia("nonexistent-id", { title: "New Title" })
    ).rejects.toThrow("Record to update not found.");
  });
});

describe("deleteMedia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should delete media by id", async () => {
    const deleted = { id: "media-1", title: "Deleted Media" };

    vi.mocked(prisma.media.delete).mockResolvedValue(deleted as any);

    const result = await deleteMedia("media-1");

    expect(prisma.media.delete).toHaveBeenCalledWith({
      where: { id: "media-1" },
    });
    expect(result).toEqual(deleted);
  });

  test("should throw when deleting a non-existent media", async () => {
    vi.mocked(prisma.media.delete).mockRejectedValue(
      new Error("Record to delete does not exist.")
    );

    await expect(deleteMedia("nonexistent-id")).rejects.toThrow(
      "Record to delete does not exist."
    );
  });
});
