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

    async function handleRegister() {
        await api.post("/register", {
            username,
            email,
            password,
        });

        onHide();
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Register
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
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
                <Button onClick={handleRegister}>
                    Register
                </Button>
            </Modal.Footer>
        </Modal>
    )
}