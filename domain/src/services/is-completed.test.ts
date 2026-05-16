import { expect, test, describe } from "vitest";
import { isCompleted } from "./is-completed";
import type { Anime, Game, Book } from "../entities/media/media.types";

describe("isCompleted", () => {
  test("should return false when current progress is less than total", () => {
    const anime: Anime = {
      id: "1",
      title: "Shangri-La Frontier",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 18,
        total: 25,
        unit: "episode",
      },
    };

    expect(isCompleted(anime)).toBe(false);
  });

  test("should return true when current progress equals total", () => {
    const anime: Anime = {
      id: "1",
      title: "Steins;Gate",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 24,
        total: 24,
        unit: "episode",
      },
    };

    expect(isCompleted(anime)).toBe(true);
  });

  test("should return true when current progress exceeds total", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 30,
        total: 24,
        unit: "episode",
      },
    };

    expect(isCompleted(anime)).toBe(true);
  });

  test("should return false when total is undefined (open-ended media)", () => {
    const game: Game = {
      id: "1",
      title: "Test Game",
      type: "game",
      activity: "play",
      status: "playing",
      progress: {
        current: 50,
        unit: "hour",
      },
    };

    expect(isCompleted(game)).toBe(false);
  });

  test("should return false when current is 0 and total is defined", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 0,
        total: 24,
        unit: "episode",
      },
    };

    expect(isCompleted(anime)).toBe(false);
  });

  test("should work with books using page unit", () => {
    const book: Book = {
      id: "1",
      title: "Test Book",
      type: "book",
      activity: "read",
      status: "reading",
      progress: {
        current: 300,
        total: 300,
        unit: "page",
      },
    };

    expect(isCompleted(book)).toBe(true);
  });

  test("should work with games using hour unit", () => {
    const game: Game = {
      id: "1",
      title: "NieR: Automata",
      type: "game",
      activity: "play",
      status: "playing",
      progress: {
        current: 60,
        total: 60,
        unit: "hour",
      },
    };

    expect(isCompleted(game)).toBe(true);
  });

  test("should return false when total is 0 (falsy value treated as undefined)", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "watching",
      progress: {
        current: 0,
        total: 0,
        unit: "episode",
      },
    };

    expect(isCompleted(anime)).toBe(false);
  });
});
