import { expect, test, describe, vi, beforeEach } from "vitest";
import * as jwt from "../auth/jwt";

vi.mock("../prisma/client", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../prisma/client";
import { registerUser } from "./register-user";

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("creates user with hashed password", async () => {
    const createdUser = {
      id: "user-1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: "$2b$10$hashed",
      role: "USER",
    };

    vi.mocked(prisma.user.create).mockResolvedValue(createdUser);

    const result = await registerUser({
      username: "testuser",
      email: "test@test.com",
      password: "secret123",
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        username: "testuser",
        email: "test@test.com",
      }),
    });

    const callData = vi.mocked(prisma.user.create).mock.calls[0][0].data;
    expect(callData.passwordHash).toBeDefined();
    expect(callData.passwordHash).not.toBe("secret123");
    expect(result).toEqual(createdUser);
  });

  test("returns the created user from prisma", async () => {
    const createdUser = {
      id: "new-user",
      username: "newuser",
      email: "new@test.com",
      passwordHash: "$2b$10$hashed",
      role: "USER",
    };

    vi.mocked(prisma.user.create).mockResolvedValue(createdUser);

    const result = await registerUser({
      username: "newuser",
      email: "new@test.com",
      password: "password",
    });

    expect(result).toEqual(createdUser);
  });
});
