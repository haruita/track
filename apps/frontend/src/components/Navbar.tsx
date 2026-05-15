import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Track
        </Link>

        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>

          <Link className="nav-link" to="/admin">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}