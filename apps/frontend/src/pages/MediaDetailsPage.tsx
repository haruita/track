import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Media } from "../types/media";

export function MediaDetailsPage() {
  const { id } = useParams();

  const [media, setMedia] = useState<Media | null>(null);

  async function loadMedia() {
    const response = await api.get(
      `/media/${id}`
    );

    setMedia(response.data);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  if (!media) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4">
      <h1>{media.title}</h1>

      <p>
        Status: {media.status}
      </p>

      <p>
        Progress:
        {" "}
        {media.progressCurrent}
        /
        {media.progressTotal}
        {" "}
        {media.progressUnit}
      </p>
    </div>
  );
}