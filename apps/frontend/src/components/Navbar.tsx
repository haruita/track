import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

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

  const [isLogged, setIsLogged] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setIsLogged(false);
      setIsAdmin(false);

      return;
    }

    setIsLogged(true);

    const payload = parseJwt(token);

    if (payload?.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");

    setIsLogged(false);
    setIsAdmin(false);

    navigate("/");

    window.location.reload();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link
          className="navbar-brand"
          to="/"
        >
          Track
        </Link>

        <div className="navbar-nav ms-auto align-items-center">
          <Link
            className="nav-link"
            to="/"
          >
            Home
          </Link>

          {isLogged && (
            <Link
              className="nav-link"
              to="/profile"
            >
              Profile
            </Link>
          )}

          {isLogged && isAdmin && (
            <Link
              className="nav-link"
              to="/admin"
            >
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