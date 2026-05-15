import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Media, UserMedia } from "../types/media";
import { formatType } from "../utils/formatType";

type Props = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
};

type JwtPayload = {
  role?: string;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function Navbar({
  onLoginClick,
  onRegisterClick,
}: Props) {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [myMediaIds, setMyMediaIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLogged(false);
      setIsAdmin(false);
      return;
    }
    setIsLogged(true);
    const payload = parseJwt(token);
    if (payload?.role === "ADMIN") {
      setIsAdmin(true);
    }
    loadMyMedia();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadMyMedia() {
    try {
      const response = await api.get("/users/me/media");
      const ids = new Set((response.data as UserMedia[]).map((um) => um.mediaId));
      setMyMediaIds(ids);
    } catch {
      setMyMediaIds(new Set());
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);

    timerRef.current = setTimeout(async () => {
      try {
        const response = await api.get("/media", { params: { q: value } });
        setSearchResults(response.data);
      } catch {
        setSearchResults([]);
      }
    }, 300);
  }

  function handleSelectMedia(item: Media) {
    setSearchQuery("");
    setShowDropdown(false);
    navigate(`/media/${item.id}`);
  }

  async function handleAddToList(e: React.MouseEvent, mediaId: string) {
    e.stopPropagation();
    try {
      await api.post(`/users/me/media/${mediaId}`);
      setMyMediaIds((prev) => new Set(prev).add(mediaId));
    } catch {
      console.error("Failed to add to list");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLogged(false);
    setIsAdmin(false);
    setMyMediaIds(new Set());
    navigate("/");
    window.location.reload();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Track
        </Link>

        <div className="d-flex align-items-center flex-grow-1 mx-3" ref={wrapperRef}>
          <div className="position-relative" style={{ maxWidth: "400px", width: "100%" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search media..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
            />
            {showDropdown && searchResults.length > 0 && (
              <div
                className="position-absolute w-100 mt-1 border rounded overflow-auto"
                style={{ maxHeight: "300px", zIndex: 1000, backgroundColor: "#fff" }}
              >
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="px-3 py-2 d-flex align-items-center gap-2"
                    style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
                    onMouseDown={() => handleSelectMedia(item)}
                  >
                    {item.imageUrl && (
                      <img
                        src={`http://localhost:3000${item.imageUrl}`}
                        alt=""
                        style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "4px" }}
                      />
                    )}
                    <div className="text-truncate flex-grow-1">
                      <div className="fw-semibold text-dark">{item.title}</div>
                      <small className="text-muted">{formatType(item.type)}</small>
                    </div>
                    {isLogged && myMediaIds.has(item.id) ? (
                      <span className="badge bg-success">✓</span>
                    ) : isLogged ? (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onMouseDown={(e) => handleAddToList(e, item.id)}
                      >
                        Add
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="navbar-nav ms-auto align-items-center">
          <Link className="nav-link" to="/">
            Home
          </Link>

          {isLogged && (
            <Link className="nav-link" to="/profile">
              Profile
            </Link>
          )}

          {isLogged && isAdmin && (
            <Link className="nav-link" to="/admin">
              Admin
            </Link>
          )}

          {isLogged ? (
            <button
              className="btn btn-outline-light ms-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="btn btn-outline-light ms-3 me-2"
                onClick={onLoginClick}
              >
                Login
              </button>

              <button
                className="btn btn-primary"
                onClick={onRegisterClick}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
