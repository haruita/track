import { expect, test, describe } from "vitest";
import { isCompleted } from "./is-completed";
import type { Anime, Game, Book } from "../entities/media/media.types";

describe("isCompleted", () => {
  test("returns false when progress current is less than total", () => {
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

  test("returns true when progress current equals total", () => {
    const anime: Anime = {
      id: "1",
      title: "Steins;Gate",
      type: "anime",
      activity: "watch",
      status: "completed",
      progress: {
        current: 24,
        total: 24,
        unit: "episode",
      },
    };

    expect(isCompleted(anime)).toBe(true);
  });

  test("returns true when progress current exceeds total", () => {
    const anime: Anime = {
      id: "1",
      title: "Test Anime",
      type: "anime",
      activity: "watch",
      status: "completed",
      progress: {
        current: 30,
        total: 24,
        unit: "episode",
      },
    };

    expect(isCompleted(anime)).toBe(true);
  });

  test("returns false when total is undefined", () => {
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

  test("returns false when current is 0", () => {
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

  test("works with books using page unit", () => {
    const book: Book = {
      id: "1",
      title: "Test Book",
      type: "book",
      activity: "read",
      status: "completed",
      progress: {
        current: 300,
        total: 300,
        unit: "page",
      },
    };

    expect(isCompleted(book)).toBe(true);
  });

  test("works with games using hour unit", () => {
    const game: Game = {
      id: "1",
      title: "NieR: Automata",
      type: "game",
      activity: "play",
      status: "completed",
      progress: {
        current: 60,
        total: 60,
        unit: "hour",
      },
    };

    expect(isCompleted(game)).toBe(true);
  });
});
