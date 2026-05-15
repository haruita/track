import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Media } from "../types/media";
import { formatType } from "../utils/formatType";

export function AdminPage() {
  const [media, setMedia] = useState<Media[]>([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("anime");
  const [activity, setActivity] = useState("watch");
  const [status, setStatus] = useState("watching");
  const [progressTotal, setProgressTotal] = useState(12);
  const [progressUnit, setProgressUnit] = useState("episode");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  async function loadMedia() {
    const response = await api.get("/media");
    setMedia(response.data);
  }

  async function saveMedia() {
    if (!title.trim()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("activity", activity);
    formData.append("status", status);
    formData.append("progressTotal", String(progressTotal));
    formData.append("progressUnit", progressUnit);
    formData.append("description", description);

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else if (existingImageUrl) {
      formData.append("imageUrl", existingImageUrl);
    }

    if (editingId) {
      await api.put(`/media/${editingId}`, formData);
    } else {
      await api.post("/media", formData);
    }

    resetForm();
    loadMedia();
  }

  async function deleteMedia(id: string) {
    await api.delete(`/media/${id}`);
    loadMedia();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function startEditing(item: Media) {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    setActivity(item.activity);
    setStatus(item.status);
    setProgressTotal(item.progressTotal ?? 0);
    setProgressUnit(item.progressUnit);
    setDescription(item.description ?? "");
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl(item.imageUrl ?? "");
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setType("anime");
    setActivity("watch");
    setStatus("watching");
    setProgressTotal(12);
    setProgressUnit("episode");
    setDescription("");
    setSelectedFile(null);
    setPreviewUrl("");
    setExistingImageUrl("");
  }

  useEffect(() => {
    loadMedia();
  }, []);

  const displayUrl = previewUrl || existingImageUrl;

  const formField = (
    label: string,
    description: string,
    input: React.ReactNode
  ) => (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      {input}
      <div className="form-text">{description}</div>
    </div>
  );

  return (
    <div className="container py-4">
      <h1 className="mb-4">Admin Panel</h1>

      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3">
          {editingId ? "Edit Media" : "Create Media"}
        </h5>

        {formField(
          "Title",
          "The name of the media entry.",
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}

        {formField(
          "Type",
          "The category this media belongs to.",
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="anime">Anime</option>
            <option value="movie">Movie</option>
            <option value="game">Game</option>
            <option value="book">Book</option>
            <option value="visual_novel">Visual Novel</option>
            <option value="podcast">Podcast</option>
            <option value="music_album">Music Album</option>
          </select>
        )}

        {formField(
          "Activity",
          "The action verb associated with this type of media.",
          <select
            className="form-select"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="watch">Watch</option>
            <option value="read">Read</option>
            <option value="play">Play</option>
            <option value="listen">Listen</option>
          </select>
        )}

        {formField(
          "Status",
          "Current progress state of the media.",
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="planned">Planned</option>
            <option value="watching">Watching</option>
            <option value="reading">Reading</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
          </select>
        )}

        {formField(
          "Progress Unit",
          "The unit used to measure progress (episodes, chapters, hours, etc).",
          <select
            className="form-select"
            value={progressUnit}
            onChange={(e) => setProgressUnit(e.target.value)}
          >
            <option value="episode">Episodes</option>
            <option value="chapter">Chapters</option>
            <option value="page">Pages</option>
            <option value="hour">Hours</option>
            <option value="track">Tracks</option>
          </select>
        )}

        {formField(
          "Total",
          "The total count of units to complete this media.",
          <input
            type="number"
            className="form-control"
            value={progressTotal}
            onChange={(e) => setProgressTotal(Number(e.target.value))}
          />
        )}

        {formField(
          "Cover Image",
          "Upload a cover image for this media entry.",
          <>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            {displayUrl && (
              <div className="mt-2">
                <img
                  src={displayUrl.startsWith("/") ? `http://localhost:3000${displayUrl}` : displayUrl}
                  alt="Preview"
                  style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover", borderRadius: "4px" }}
                />
              </div>
            )}
          </>
        )}

        {formField(
          "Description",
          "A short summary of the media content.",
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        )}

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={saveMedia}
          >
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {media.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{formatType(item.type)}</td>
                  <td>{formatType(item.status)}</td>
                  <td>
                    {item.progressTotal ?? "—"} {item.progressTotal ? formatType(item.progressUnit) : ""}s
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => startEditing(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteMedia(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
