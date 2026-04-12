import { Media } from "../entities/media/media";

export function completeMedia<T extends Media>(media: Media) {
    return {
        ...media,
        status: "completed",
        progress: {
            ...media.progress,
            current: media.progress.total ?? media.progress.current,
        }
    }
}