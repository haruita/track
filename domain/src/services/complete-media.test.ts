import { expect, test, describe } from "vitest";
import { completeMedia } from "./complete-media";
import type { Anime, Game } from "../entities/media/media.types";

describe("completeMedia", () => {
  test("sets status to completed", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 10,
        total: 24,
        unit: "episode",
      },
    };

    const result = completeMedia(anime);

    expect(result.status).toBe("completed");
  });

  test("sets progress current to total when total exists", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 10,
        total: 24,
        unit: "episode",
      },
    };

    const result = completeMedia(anime);

    expect(result.progress.current).toBe(24);
  });

  test("keeps progress current unchanged when total is undefined", () => {
    const game: Game = {
      id: "1",
      title: "Test Game",
      type: "game",
      activity: "play",
      status: "playing",
      progress: {
        current: 30,
        unit: "hour",
      },
    };

    const result = completeMedia(game);

    expect(result.progress.current).toBe(30);
  });

  test("returns a new object without mutating original", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 10,
        total: 24,
        unit: "episode",
      },
    };

    const result = completeMedia(anime);

    expect(result).not.toBe(anime);
    expect(anime.status).toBe("watching");
    expect(anime.progress.current).toBe(10);
  });

  test("works with already completed media", () => {
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

    const result = completeMedia(anime);

    expect(result.status).toBe("completed");
    expect(result.progress.current).toBe(24);
  });
});
