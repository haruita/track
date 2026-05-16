import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";

describe("jwt", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret-key";
    vi.resetModules();
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  test("should return a non-empty string token when generating", async () => {
    const { generateToken } = await import("./jwt");

    const token = generateToken({ id: "user-1", role: "USER" });

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  test("should decode the same payload that was encoded", async () => {
    const { generateToken, verifyToken } = await import("./jwt");

    const payload = { id: "user-123", role: "ADMIN" };
    const token = generateToken(payload);
    const decoded = verifyToken(token) as typeof payload;

    expect(decoded.id).toBe("user-123");
    expect(decoded.role).toBe("ADMIN");
  });

  test("should throw when verifying an invalid token", async () => {
    const { verifyToken } = await import("./jwt");

    expect(() => verifyToken("this-is-not-a-jwt")).toThrow();
  });

  test("should throw when verifying a malformed token", async () => {
    const { verifyToken } = await import("./jwt");

    expect(() => verifyToken("abc.def.ghi")).toThrow();
  });

  test("should include exp and iat claims in the decoded token", async () => {
    const { generateToken, verifyToken } = await import("./jwt");

    const token = generateToken({ id: "1", role: "USER" });
    const decoded = verifyToken(token) as { exp: number; iat: number };

    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });

  test("should throw when secret is not set", async () => {
    process.env.JWT_SECRET = "";
    vi.resetModules();

    const { generateToken } = await import("./jwt");

    expect(() => generateToken({ id: "1" })).toThrow();
  });
});
