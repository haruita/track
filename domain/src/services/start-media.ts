import { Media } from "../entities/media/media";

export function startMedia<T extends Media>(media: Media) {
    if (media.status !== "planned") return media;

    switch (media.activity) {
        case "watch": return {...media, status: "watching"};
        case "listen": return {...media, status: "listening"};
        case "play": return {...media, status: "playing"};
        case "read": return {...media, status: "reading"};
    }
}