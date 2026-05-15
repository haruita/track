import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Media } from "../types/media";

import { MediaCard }
  from "../components/MediaCard";

export function HomePage() {
  const [media, setMedia] =
    useState<Media[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadMedia() {
    try {
      const response =
        await api.get("/media");

      setMedia(response.data);
    } catch {
      setError(
        "Failed to load media"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
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
      <h1 className="mb-4">
        Media Library
      </h1>

      <div className="row">
        {media.map((item) => (
          <div
            key={item.id}
            className="col-md-4 mb-4"
          >
            <MediaCard
              media={item}
            />
          </div>
        ))}
      </div>
    </div>
  );
}