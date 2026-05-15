import { expect, test, describe } from "vitest";
import { startMedia } from "./start-media";
import type { Anime, Game, Album, Book } from "../entities/media/media.types";

describe("startMedia", () => {
  test("transitions anime from planned to watching", () => {
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

  test("transitions game from planned to playing", () => {
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

  test("transitions album from planned to listening", () => {
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

  test("transitions book from planned to reading", () => {
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

  test("returns same media if status is not planned", () => {
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
    expect(result!.status).toBe("watching");
  });

  test("returns same media if status is completed", () => {
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
  });

  test("returns a new object when transitioning", () => {
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
});
