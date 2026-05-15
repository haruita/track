import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Media } from "../types/media";

export function AdminPage() {
  const [media, setMedia] = useState<Media[]>([]);

  const [title, setTitle] = useState("");

  async function loadMedia() {
    const response = await api.get("/media");

    setMedia(response.data);
  }

  async function createMedia() {
    await api.post("/media", {
      title,

      type: "anime",

      activity: "watch",
      status: "watching",

      progressCurrent: 0,
      progressTotal: 12,

      progressUnit: "episode",
    });

    setTitle("");

    loadMedia();
  }

  async function deleteMedia(id: string) {
    await api.delete(`/media/${id}`);

    loadMedia();
  }

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        Admin Panel
      </h1>

      <div className="card p-4 mb-4">
        <h5>Create Media</h5>

        <input
          className="form-control mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <button
          className="btn btn-primary"
          onClick={createMedia}
        >
          Create
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {media.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>

              <td>{item.status}</td>

              <td>
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    deleteMedia(item.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}