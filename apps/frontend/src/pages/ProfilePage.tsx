import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Media } from "../types/media";
import { MediaCard } from "../components/MediaCard";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function ProfilePage() {
  const [user, setUser] =
    useState<User | null>(null);

  const [media, setMedia] =
    useState<Media[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadProfile() {
    try {
      const [
        userResponse,
        mediaResponse,
      ] = await Promise.all([
        api.get("/users/me"),

        api.get("/media"),
      ]);

      setUser(userResponse.data);

      setMedia(mediaResponse.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

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
          Failed to load profile
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2>
            {user.name}
          </h2>

          <p className="mb-1">
            <strong>Email:</strong>
            {" "}
            {user.email}
          </p>

          <p className="mb-0">
            <strong>Role:</strong>
            {" "}
            {user.role}
          </p>
        </div>
      </div>

      <h3 className="mb-4">
        My Media
      </h3>

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