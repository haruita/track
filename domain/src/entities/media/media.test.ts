import { Anime } from "./media.types";
import { isCompleted } from "../../services/is-completed";

import { expect, test, vi } from 'vitest';


test('Verify if this anime is not completed yet', () => {
    let anime: Anime = {
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
})