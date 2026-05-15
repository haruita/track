import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Media } from "../types/media";
import { MediaCard } from "../components/MediaCard";

export function ProfilePage() {
    const [media, setMedia] = useState<Media[]>([]);

    async function loadMedia() {
        const response = await api.get("/media");

        setMedia(response.data);
    }

    useEffect(() => {
        loadMedia();
    }, []);

    return (
        <div className="container py-4">
            <h1 className="mb-4">
                My Collection
            </h1>

            <div className="row">
                {media.map((item) => (
                    <MediaCard
                        key={item.id}
                        media={item}
                    />
                ))}
            </div>
        </div>
    );
}