import { expect, test, describe } from "vitest";
import { completeMedia } from "./complete-media";
import type { Anime, Game } from "../entities/media/media.types";

describe("completeMedia", () => {
  test("should set status to 'completed' regardless of current status", () => {
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

  test("should set progress current to total when total is defined", () => {
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

  test("should keep progress current unchanged when total is undefined", () => {
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

  test("should return a new object without mutating the original", () => {
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

  test("should preserve id, title, type and activity in the result", () => {
    const anime: Anime = {
      id: "media-abc",
      title: "Steins;Gate",
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

    expect(result.id).toBe("media-abc");
    expect(result.title).toBe("Steins;Gate");
    expect(result.type).toBe("anime");
    expect(result.activity).toBe("watch");
  });

  test("should work when media is already completed", () => {
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
