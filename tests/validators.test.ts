import { describe, it, expect } from "vitest";
import { string, number, boolean, enumType } from "../src/validators";

describe("validators", () => {
  describe("string()", () => {
    it("parses valid strings", () => {
      const v = string();
      expect(v.parse("hello")).toBe("hello");
      expect(v.parse("123")).toBe("123");
    });

    it("throws on missing or empty", () => {
      const v = string();
      expect(() => v.parse(undefined)).toThrow("Missing or empty string");
      expect(() => v.parse("")).toThrow("Missing or empty string");
    });
  });

  describe("number()", () => {
    it("parses valid numbers", () => {
      const v = number();
      expect(v.parse("123")).toBe(123);
      expect(v.parse("-42.5")).toBe(-42.5);
      expect(v.parse("0")).toBe(0);
    });

    it("throws on invalid or missing", () => {
      const v = number();
      expect(() => v.parse(undefined)).toThrow("Missing value");
      expect(() => v.parse("")).toThrow("Missing value");
      expect(() => v.parse("hello")).toThrow("Invalid number");
    });
  });

  describe("boolean()", () => {
    it("parses valid booleans", () => {
      const v = boolean();
      expect(v.parse("true")).toBe(true);
      expect(v.parse("1")).toBe(true);
      expect(v.parse("false")).toBe(false);
      expect(v.parse("0")).toBe(false);
    });

    it("throws on invalid or missing", () => {
      const v = boolean();
      expect(() => v.parse(undefined)).toThrow("Missing value");
      expect(() => v.parse("")).toThrow("Missing value");
      expect(() => v.parse("yes")).toThrow("Invalid boolean");
    });
  });

  describe("enumType()", () => {
    it("parses valid enum values", () => {
      const v = enumType(["development", "production"] as const);
      expect(v.parse("development")).toBe("development");
      expect(v.parse("production")).toBe("production");
    });

    it("throws on invalid or missing", () => {
      const v = enumType(["development", "production"] as const);
      expect(() => v.parse(undefined)).toThrow("Missing value");
      expect(() => v.parse("")).toThrow("Missing value");
      expect(() => v.parse("staging")).toThrow(
        "Invalid enum value. Expected one of: development, production",
      );
    });
  });
});
