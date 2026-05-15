import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Media } from "../types/media";

export function AdminPage() {
  const [media, setMedia] =
    useState<Media[]>([]);

  const [title, setTitle] =
    useState("");

  const [type, setType] =
    useState("anime");

  const [activity, setActivity] =
    useState("watch");

  const [status, setStatus] =
    useState("watching");

  const [
    progressTotal,
    setProgressTotal,
  ] = useState(12);

  const [
    progressUnit,
    setProgressUnit,
  ] = useState("episode");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  async function loadMedia() {
    const response =
      await api.get("/media");

    setMedia(response.data);
  }

  async function saveMedia() {
    if (!title.trim()) {
      return;
    }

    const payload = {
      title,
      type,
      activity,
      status,
      progressCurrent: 0,
      progressTotal,
      progressUnit,
    };

    // UPDATE
    if (editingId) {
      await api.put(
        `/media/${editingId}`,
        payload
      );
    }

    // CREATE
    else {
      await api.post(
        "/media",
        payload
      );
    }

    resetForm();
    loadMedia();
  }

  async function deleteMedia(
    id: string
  ) {
    await api.delete(
      `/media/${id}`
    );

    loadMedia();
  }

  function startEditing(
    item: Media
  ) {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    setActivity(item.activity);
    setStatus(item.status);
    setProgressTotal(
      item.progressTotal ?? 0
    );

    setProgressUnit(
      item.progressUnit
    );
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setType("anime");
    setActivity("watch");
    setStatus("watching");
    setProgressTotal(12);
    setProgressUnit("episode");
  }

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4">
        Admin Panel
      </h1>

      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3">
          {editingId
            ? "Edit Media"
            : "Create Media"}
        </h5>

        <input
          className="form-control mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <select
          className="form-select mb-3"
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option value="anime">
            Anime
          </option>

          <option value="movie">
            Movie
          </option>

          <option value="game">
            Game
          </option>

          <option value="book">
            Book
          </option>

          <option value="visual_novel">
            Visual Novel
          </option>

          <option value="podcast">
            Podcast
          </option>

          <option value="music_album">
            Music Album
          </option>
        </select>

        <select
          className="form-select mb-3"
          value={activity}
          onChange={(e) =>
            setActivity(
              e.target.value
            )
          }
        >
          <option value="watch">
            Watch
          </option>

          <option value="read">
            Read
          </option>

          <option value="play">
            Play
          </option>

          <option value="listen">
            Listen
          </option>
        </select>

        <select
          className="form-select mb-3"
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
        >
          <option value="planned">
            Planned
          </option>

          <option value="watching">
            Watching
          </option>

          <option value="reading">
            Reading
          </option>

          <option value="playing">
            Playing
          </option>

          <option value="completed">
            Completed
          </option>
        </select>

        <select
          className="form-select mb-3"
          value={progressUnit}
          onChange={(e) =>
            setProgressUnit(
              e.target.value
            )
          }
        >
          <option value="episode">
            Episode
          </option>

          <option value="chapter">
            Chapter
          </option>

          <option value="page">
            Page
          </option>

          <option value="hour">
            Hour
          </option>

          <option value="track">
            Track
          </option>
        </select>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Total"
          value={progressTotal}
          onChange={(e) =>
            setProgressTotal(
              Number(
                e.target.value
              )
            )
          }
        />

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={saveMedia}
          >
            {editingId
              ? "Update"
              : "Create"}
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

                <th>Progress</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {media.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.title}
                  </td>

                  <td>
                    {item.type}
                  </td>

                  <td>
                    {item.status}
                  </td>

                  <td>
                    {item.progressCurrent}
                    /
                    {item.progressTotal}
                    {" "}
                    {
                      item.progressUnit
                    }
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          startEditing(
                            item
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          deleteMedia(
                            item.id
                          )
                        }
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