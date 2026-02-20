import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { expectTypeOf } from "expect-type";
import {
  createEnv,
  EnvValidationError,
  string,
  number,
  boolean,
  enumType,
} from "../src";

describe("createEnv()", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("parses a valid environment", () => {
    process.env = {}; // Clear completely for test
    process.env.PORT = "8080";
    process.env.DATABASE_URL = "postgres://localhost/db";
    process.env.NODE_ENV = "development";
    process.env.DEBUG = "true";

    const env = createEnv({
      PORT: number(),
      DATABASE_URL: string(),
      NODE_ENV: enumType(["development", "production"] as const),
      DEBUG: boolean(),
    });

    expect(env.PORT).toBe(8080);
    expect(env.DATABASE_URL).toBe("postgres://localhost/db");
    expect(env.NODE_ENV).toBe("development");
    expect(env.DEBUG).toBe(true);

    expectTypeOf(env).toEqualTypeOf<{
      PORT: number;
      DATABASE_URL: string;
      NODE_ENV: "development" | "production";
      DEBUG: boolean;
    }>();
  });

  it("throws aggregated errors on missing or invalid variables", () => {
    process.env = {}; // Clear completely for test
    process.env.PORT = "not-a-number";
    process.env.DEBUG = "yes";
    // DATABASE_URL is missing
    // NODE_ENV is missing

    try {
      createEnv({
        PORT: number(),
        DATABASE_URL: string(),
        NODE_ENV: enumType(["development", "production"] as const),
        DEBUG: boolean(),
      });
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(EnvValidationError);
      const e = error as EnvValidationError;

      expect(e.issues).toHaveLength(4);
      expect(e.issues.map((i) => i.key)).toEqual([
        "PORT",
        "DATABASE_URL",
        "NODE_ENV",
        "DEBUG",
      ]);
      expect(e.message).toContain("PORT: Invalid number");
      expect(e.message).toContain("DATABASE_URL: Missing or empty string");
      expect(e.message).toContain("NODE_ENV: Missing value");
      expect(e.message).toContain("DEBUG: Invalid boolean");
    }
  });
});
