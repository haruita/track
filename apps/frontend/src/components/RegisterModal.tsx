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

export function RegisterModal({
    show,
    onHide,
}: Props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        try {
            setLoading(true);
            setError("");

            await api.post("/auth/register", {
                username,
                email,
                password,
            });

            const response = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            onHide();
            window.location.reload();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Could not register user.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Register
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
                        <Form.Label>Username</Form.Label>

                        <Form.Control
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>

                        <Form.Control
                            type="email"
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
                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
