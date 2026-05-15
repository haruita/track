import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Media } from "../types/media";
import { formatType } from "../utils/formatType";
import { resolveImageUrl } from "../utils/resolveImageUrl";

export function MediaDetailsPage() {
  const { id } = useParams();

  const [media, setMedia] = useState<Media | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadMedia() {
    try {
      const response = await api.get(`/media/${id}`);

      setMedia(response.data);
    } catch {
      setError("Media not found");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-4">
        Loading...
      </div>
    );
  }

  if (error || !media) {
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
      <div className="card shadow-sm">
        {media.imageUrl && (
          <div
            style={{
              width: "100%",
              maxHeight: "400px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#1a1a2e",
            }}
          >
            <img
              src={resolveImageUrl(media.imageUrl)}
              alt={media.title}
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
          </div>
        )}
        <div className="card-body">
          <h1 className="mb-3">{media.title}</h1>

          <p>
            <strong>Type:</strong> {formatType(media.type)}
          </p>

          <p>
            <strong>Activity:</strong> {formatType(media.activity)}
          </p>

          <p>
            <strong>Status:</strong> {formatType(media.status)}
          </p>

          <p>
            <strong>Progress:</strong> {media.progressCurrent}/{media.progressTotal}{" "}
            {formatType(media.progressUnit)}
          </p>

          {media.description && (
            <p>
              <strong>Description:</strong> {media.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
