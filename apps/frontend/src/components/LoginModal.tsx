import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../api/client";

type Props = {
  show: boolean;
  onHide: () => void;
};

export function LoginModal({
  show,
  onHide,
}: Props) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      setError("");

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const token =
        response.data.token;

      localStorage.setItem(
        "token",
        token
      );

      onHide();

      window.location.reload();
    } catch {
      setError(
        "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Login
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Email
            </Form.Label>

            <Form.Control
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Password
            </Form.Label>

            <Form.Control
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}