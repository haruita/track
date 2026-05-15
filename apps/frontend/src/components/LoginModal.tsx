import { useState } from "react";

import {
  Modal,
  Button,
  Form,
} from "react-bootstrap";

import { api } from "../api/client";

type Props = {
  show: boolean;
  onHide: () => void;
};

export function LoginModal({
  show,
  onHide,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const response = await api.post(
      "/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      response.data.token
    );

    onHide();
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          Login
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>

            <Form.Control
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleLogin}>
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}