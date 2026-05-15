import { expect, test, describe, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";

vi.mock("../prisma/client", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    vi.resetModules();
  });

  describe("POST /auth/register", () => {
    test("creates user and returns it", async () => {
      const { prisma } = await import("../prisma/client");
      const { app } = await import("../app");

      const createdUser = {
        id: "user-1",
        username: "testuser",
        email: "test@test.com",
        passwordHash: "$2b$10$hashed",
        role: "USER",
      };

      vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any);

      const response = await request(app)
        .post("/auth/register")
        .send({
          username: "testuser",
          email: "test@test.com",
          password: "secret123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", "user-1");
      expect(response.body).toHaveProperty("username", "testuser");
      expect(response.body).toHaveProperty("email", "test@test.com");
    });

    test("returns 400 on failure", async () => {
      const { prisma } = await import("../prisma/client");
      const { app } = await import("../app");

      vi.mocked(prisma.user.create).mockRejectedValue(new Error("DB error"));

      const response = await request(app)
        .post("/auth/register")
        .send({
          username: "testuser",
          email: "test@test.com",
          password: "secret123",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /auth/login", () => {
    test("returns token on valid credentials", async () => {
      const { prisma } = await import("../prisma/client");
      const { app } = await import("../app");

      const user = {
        id: "user-1",
        username: "testuser",
        email: "test@test.com",
        passwordHash: await bcrypt.hash("secret123", 10),
        role: "USER",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@test.com",
          password: "secret123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    test("returns 401 on invalid credentials", async () => {
      const { prisma } = await import("../prisma/client");
      const { app } = await import("../app");

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@test.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });

    test("returns 401 when user does not exist", async () => {
      const { prisma } = await import("../prisma/client");
      const { app } = await import("../app");

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "nonexistent@test.com",
          password: "password",
        });

      expect(response.status).toBe(401);
    });
  });
});
