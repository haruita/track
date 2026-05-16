import { expect, test, describe } from "vitest";
import { startMedia } from "./start-media";
import type { Anime, Game, Album, Book } from "../entities/media/media.types";

describe("startMedia", () => {
  test("should transition anime from 'planned' to 'watching'", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "planned",
      progress: {
        current: 0,
        total: 24,
        unit: "episode",
      },
    };

    const result = startMedia(anime);

    expect(result!.status).toBe("watching");
  });

  test("should transition game from 'planned' to 'playing'", () => {
    const game: Game = {
      id: "1",
      title: "Test Game",
      type: "game",
      activity: "play",
      status: "planned",
      progress: {
        current: 0,
        unit: "hour",
      },
    };

    const result = startMedia(game);

    expect(result!.status).toBe("playing");
  });

  test("should transition album from 'planned' to 'listening'", () => {
    const album: Album = {
      id: "1",
      title: "Test Album",
      type: "album",
      activity: "listen",
      status: "planned",
      progress: {
        current: 0,
        unit: "track",
      },
    };

    const result = startMedia(album);

    expect(result!.status).toBe("listening");
  });

  test("should transition book from 'planned' to 'reading'", () => {
    const book: Book = {
      id: "1",
      title: "Test Book",
      type: "book",
      activity: "read",
      status: "planned",
      progress: {
        current: 0,
        unit: "chapter",
      },
    };

    const result = startMedia(book);

    expect(result!.status).toBe("reading");
  });

  test("should return the same reference when status is not 'planned'", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 5,
        total: 24,
        unit: "episode",
      },
    };

    const result = startMedia(anime);

    expect(result).toBe(anime);
  });

  test("should not change status when media is already completed", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "completed",
      progress: {
        current: 24,
        total: 24,
        unit: "episode",
      },
    };

    const result = startMedia(anime);

    expect(result).toBe(anime);
    expect(result!.status).toBe("completed");
  });

  test("should return a new object when transitioning from planned", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "planned",
      progress: {
        current: 0,
        total: 24,
        unit: "episode",
      },
    };

    const result = startMedia(anime);

    expect(result).not.toBe(anime);
  });

  test("should preserve id, title, type and activity after transition", () => {
    const anime: Anime = {
      id: "media-xyz",
      title: "Original Title",
      type: "anime",
      activity: "watch",
      status: "planned",
      progress: {
        current: 0,
        total: 12,
        unit: "episode",
      },
    };

    const result = startMedia(anime);

    expect(result!.id).toBe("media-xyz");
    expect(result!.title).toBe("Original Title");
    expect(result!.type).toBe("anime");
    expect(result!.activity).toBe("watch");
  });
});
