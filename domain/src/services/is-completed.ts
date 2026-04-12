import { Media } from "../entities/media/media";

export function isCompleted<T extends Media>(media: Media): boolean {
    if (!media.progress.total) return false;
    return media.progress.current >= media.progress.total;
}