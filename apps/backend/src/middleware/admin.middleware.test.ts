import { expect, test, describe, vi } from "vitest";
import { adminMiddleware } from "./admin.middleware";

describe("adminMiddleware", () => {
  test("returns 403 when user is not authenticated", () => {
    const req = { user: undefined } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when user role is not ADMIN", () => {
    const req = { user: { id: "1", role: "USER" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when user role is ADMIN", () => {
    const req = { user: { id: "1", role: "ADMIN" } } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    adminMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
