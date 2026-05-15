import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Media, UserMedia } from "../types/media";
import { formatType } from "../utils/formatType";
import { resolveImageUrl } from "../utils/resolveImageUrl";

export function MediaDetailsPage() {
  const { id } = useParams();

  const [media, setMedia] = useState<Media | null>(null);
  const [userMedia, setUserMedia] = useState<UserMedia | null>(null);
  const [isLogged, setIsLogged] = useState(false);

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

  async function loadMyMedia() {
    try {
      const response = await api.get("/users/me/media");
      const found = (response.data as UserMedia[]).find(
        (um) => um.mediaId === id
      );
      setUserMedia(found ?? null);
    } catch {
      setUserMedia(null);
    }
  }

  async function handleAddToList() {
    if (!id) return;
    try {
      const response = await api.post(`/users/me/media/${id}`);
      setUserMedia(response.data);
    } catch {
      console.error("Failed to add to list");
    }
  }

  async function handleRemoveFromList() {
    if (!userMedia) return;
    try {
      await api.delete(`/users/me/media/${userMedia.id}`);
      setUserMedia(null);
    } catch {
      console.error("Failed to remove from list");
    }
  }

  async function updateProgress(action: "increment" | "decrement" | "set", value?: number) {
    if (!userMedia) return;
    try {
      const response = await api.patch(`/users/me/media/${userMedia.id}/progress`, {
        action,
        value,
      });
      setUserMedia(response.data);
    } catch {
      console.error("Failed to update progress");
    }
  }

  useEffect(() => {
    const logged = !!localStorage.getItem("token");
    setIsLogged(logged);
    loadMedia();
    if (logged) loadMyMedia();
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

  const total = media.progressTotal ?? 0;

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
            <strong>Total:</strong> {total} {formatType(media.progressUnit)}
          </p>

          {media.description && (
            <p>
              <strong>Description:</strong> {media.description}
            </p>
          )}

          {isLogged && userMedia && (
            <div className="mt-3 p-3 border rounded">
              <h5 className="mb-2">My Progress</h5>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={userMedia.progressCurrent <= 0}
                  onClick={() => updateProgress("decrement")}
                >
                  −
                </button>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  style={{ width: "80px" }}
                  value={userMedia.progressCurrent}
                  min={0}
                  max={total}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) updateProgress("set", val);
                  }}
                />
                <span className="text-muted">/ {total}</span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={userMedia.progressCurrent >= total}
                  onClick={() => updateProgress("increment")}
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={handleRemoveFromList}
              >
                Remove from my list
              </button>
            </div>
          )}

          {isLogged && !userMedia && (
            <button className="btn btn-success mt-3" onClick={handleAddToList}>
              Add to my list
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
