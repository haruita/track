import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Media } from "../types/media";
import { MediaCard } from "../components/MediaCard";
import { LoginModal } from "../components/LoginModal";
import { RegisterModal } from "../components/RegisterModal";

export function HomePage() {
  const [media, setMedia] = useState<Media[]>([]);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  async function loadMedia() {
    const response = await api.get("/media");

    setMedia(response.data);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Track</h1>

        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      </div>

      <div className="row">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
          />
        ))}
      </div>

      <LoginModal
        show={showLogin}
        onHide={() => setShowLogin(false)}
      />

      <RegisterModal
        show={showRegister}
        onHide={() => setShowRegister(false)}
      />
    </div>
  );
}