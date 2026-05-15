import { expect, test, describe, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import * as jwt from "../auth/jwt";

vi.mock("../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../auth/jwt", () => ({
  generateToken: vi.fn(),
  verifyToken: vi.fn(),
}));

import { prisma } from "../prisma/client";
import { loginUser } from "./login-user";

describe("loginUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("throws error when user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(
      loginUser({ email: "unknown@test.com", password: "password" })
    ).rejects.toThrow("Invalid credentials.");
  });

  test("throws error when password is incorrect", async () => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correctpassword", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);

    await expect(
      loginUser({ email: "test@test.com", password: "wrongpassword" })
    ).rejects.toThrow("Invalid credentials.");
  });

  test("returns token when credentials are valid", async () => {
    const user = {
      id: "user-123",
      username: "testuser",
      email: "test@test.com",
      passwordHash: await bcrypt.hash("correctpassword", 10),
      role: "USER",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);
    vi.mocked(jwt.generateToken).mockReturnValue("mock-jwt-token");

    const result = await loginUser({
      email: "test@test.com",
      password: "correctpassword",
    });

    expect(jwt.generateToken).toHaveBeenCalledWith({
      id: "user-123",
      role: "USER",
    });
    expect(result).toBe("mock-jwt-token");
  });

  test("includes ADMIN role in token for admin users", async () => {
    const admin = {
      id: "admin-1",
      username: "admin",
      email: "admin@test.com",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(admin);
    vi.mocked(jwt.generateToken).mockReturnValue("admin-jwt-token");

    await loginUser({ email: "admin@test.com", password: "admin123" });

    expect(jwt.generateToken).toHaveBeenCalledWith({
      id: "admin-1",
      role: "ADMIN",
    });
  });
});
