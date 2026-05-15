import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Media, UserMedia } from "../types/media";

import { MediaCard } from "../components/MediaCard";

export function HomePage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLogged, setIsLogged] = useState(false);
  const [myMediaIds, setMyMediaIds] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadMedia() {
    try {
      const response = await api.get("/media");
      setMedia(response.data);
    } catch (err: any) {
      console.error("loadMedia error:", err);
      setError(err?.response?.data?.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  async function loadMyMedia() {
    try {
      const response = await api.get("/users/me/media");
      const ids = new Set((response.data as UserMedia[]).map((um) => um.mediaId));
      setMyMediaIds(ids);
    } catch {
      setMyMediaIds(new Set());
    }
  }

  async function handleAddToList(mediaId: string) {
    try {
      await api.post(`/users/me/media/${mediaId}`);
      setMyMediaIds((prev) => new Set(prev).add(mediaId));
    } catch {
      console.error("Failed to add to list");
    }
  }

  useEffect(() => {
    const logged = !!localStorage.getItem("token");
    setIsLogged(logged);
    loadMedia();
    if (logged) loadMyMedia();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Media Library</h1>

      <div className="row">
        {media.map((item) => (
          <div
            key={item.id}
            className="col-md-4 mb-4"
          >
            <MediaCard
              media={item}
              isLogged={isLogged}
              isInMyList={myMediaIds.has(item.id)}
              onAddToList={
                isLogged && !myMediaIds.has(item.id)
                  ? () => handleAddToList(item.id)
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
