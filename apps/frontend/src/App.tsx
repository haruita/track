import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { LoginModal } from "./components/LoginModal";
import { RegisterModal } from "./components/RegisterModal";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { MediaDetailsPage } from "./pages/MediaDetailsPage";
import { AdminPage } from "./pages/AdminPage";

function App() {
  const [showLogin, setShowLogin] =
    useState(false);

  const [
    showRegister,
    setShowRegister,
  ] = useState(false);

  return (
    <>
      <Navbar
        onLoginClick={() =>
          setShowLogin(true)
        }

        onRegisterClick={() =>
          setShowRegister(true)
        }
      />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/media/:id"
          element={
            <MediaDetailsPage />
          }
        />

        <Route
          path="/admin"
          element={<AdminPage />}
        />
      </Routes>

      <LoginModal
        show={showLogin}
        onHide={() =>
          setShowLogin(false)
        }
      />

      <RegisterModal
        show={showRegister}
        onHide={() =>
          setShowRegister(false)
        }
      />
    </>
  );
}

export default App;