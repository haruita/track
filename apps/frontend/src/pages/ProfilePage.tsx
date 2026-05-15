import { useEffect, useState, useRef } from "react";
import { api } from "../api/client";
import type { UserMedia } from "../types/media";
import { formatType } from "../utils/formatType";
import { resolveImageUrl } from "../utils/resolveImageUrl";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
};

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [myMedia, setMyMedia] = useState<UserMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  async function loadProfile() {
    try {
      const userResponse = await api.get("/users/me");
      setUser(userResponse.data);

      const mediaResponse = await api.get("/users/me/media");
      setMyMedia(mediaResponse.data);
    } catch (err: any) {
      console.error("Profile load error:", err?.response?.status, err?.response?.data);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await api.put("/users/me/avatar", formData);
      setUser((prev) => (prev ? { ...prev, avatarUrl: response.data.avatarUrl } : prev));
    } catch {
      console.error("Failed to upload avatar");
    }
  }

  async function saveUsername() {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === user?.username) {
      setEditingName(false);
      setNameInput(user?.username ?? "");
      return;
    }

    try {
      const response = await api.patch("/me/username", { username: trimmed });
      setUser((prev) => (prev ? { ...prev, username: response.data.username } : prev));
    } catch {
      setNameInput(user?.username ?? "");
    }
    setEditingName(false);
  }

  function startEditingName() {
    setNameInput(user?.username ?? "");
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 0);
  }

  async function updateProgress(userMedia: UserMedia, action: "increment" | "decrement" | "set", value?: number) {
    try {
      const response = await api.patch(`/users/me/media/${userMedia.id}/progress`, {
        action,
        value,
      });
      setMyMedia((prev) =>
        prev.map((m) => (m.id === userMedia.id ? response.data : m))
      );
    } catch {
      console.error("Failed to update progress");
    }
  }

  async function removeFromList(userMedia: UserMedia) {
    try {
      await api.delete(`/users/me/media/${userMedia.id}`);
      setMyMedia((prev) => prev.filter((m) => m.id !== userMedia.id));
    } catch {
      console.error("Failed to remove from list");
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editingName]);

  if (loading) {
    return (
      <div className="container py-4">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          Failed to load profile. Please log in.
        </div>
      </div>
    );
  }

  const filteredMedia = myMedia.filter((um) =>
    um.media.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex align-items-center gap-4">
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: "#1a1a2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => fileInputRef.current?.click()}
            title="Click to change avatar"
          >
            {user.avatarUrl ? (
              <img
                src={resolveImageUrl(user.avatarUrl)}
                alt={user.username}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "2.5rem", color: "#666" }}>👤</span>
            )}
          </div>

          <div className="flex-grow-1">
            {editingName ? (
              <input
                ref={nameInputRef}
                className="form-control form-control-lg mb-1"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={saveUsername}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveUsername();
                  if (e.key === "Escape") {
                    setEditingName(false);
                    setNameInput(user.username);
                  }
                }}
              />
            ) : (
              <h2 className="mb-1" style={{ cursor: "pointer" }} onClick={startEditingName} title="Click to edit">
                {user.username}
              </h2>
            )}
            <p className="mb-0 text-muted">{user.email}</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarUpload}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">My Media</h3>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "250px" }}
          placeholder="Search my media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredMedia.length === 0 ? (
        <p className="text-muted">No media entries{searchQuery ? " matching your search" : " yet"}.</p>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th style={{ minWidth: "220px" }}>Progress</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((um) => {
                  const total = um.media.progressTotal ?? 0;
                  const isMax = um.progressCurrent >= total;
                  const isMin = um.progressCurrent <= 0;

                  return (
                    <tr key={um.id}>
                      <td className="align-middle">{um.media.title}</td>
                      <td className="align-middle">{formatType(um.media.type)}</td>
                      <td className="align-middle">{formatType(um.media.status)}</td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={isMin}
                            onClick={() => updateProgress(um, "decrement")}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ width: "70px" }}
                            value={um.progressCurrent}
                            min={0}
                            max={total}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (!isNaN(val)) updateProgress(um, "set", val);
                            }}
                          />
                          <span className="text-nowrap text-muted">/ {total}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            disabled={isMax}
                            onClick={() => updateProgress(um, "increment")}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="align-middle">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromList(um)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
