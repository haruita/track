import { expect, test, describe, vi, beforeEach } from "vitest";

describe("authMiddleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    vi.resetModules();
  });

  test("returns 401 when no authorization header", async () => {
    const { authMiddleware } = await import("./auth.middleware");

    const req = { headers: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when authorization header has no token", async () => {
    const { authMiddleware } = await import("./auth.middleware");

    const req = { headers: { authorization: "Bearer" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when token is invalid", async () => {
    const { authMiddleware } = await import("./auth.middleware");

    const req = { headers: { authorization: "Bearer invalid-token" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next and sets req.user when token is valid", async () => {
    const { authMiddleware } = await import("./auth.middleware");
    const { generateToken } = await import("../auth/jwt");

    const token = generateToken({ id: "user-1", role: "USER" });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(
      expect.objectContaining({ id: "user-1", role: "USER" })
    );
  });

  test("extracts admin role correctly", async () => {
    const { authMiddleware } = await import("./auth.middleware");
    const { generateToken } = await import("../auth/jwt");

    const token = generateToken({ id: "admin-1", role: "ADMIN" });
    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.role).toBe("ADMIN");
  });
});
