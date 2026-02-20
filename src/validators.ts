import { Validator } from "./types";

export function string(): Validator<string> {
  return {
    parse: (value: string | undefined) => {
      if (value === undefined || value === "") {
        throw new Error("Missing or empty string");
      }
      return value;
    },
  };
}

export function number(): Validator<number> {
  return {
    parse: (value: string | undefined) => {
      if (value === undefined || value === "") {
        throw new Error("Missing value");
      }
      const num = Number(value);
      if (Number.isNaN(num)) {
        throw new Error("Invalid number");
      }
      return num;
    },
  };
}

export function boolean(): Validator<boolean> {
  return {
    parse: (value: string | undefined) => {
      if (value === undefined || value === "") {
        throw new Error("Missing value");
      }
      if (value === "true" || value === "1") return true;
      if (value === "false" || value === "0") return false;
      throw new Error("Invalid boolean");
    },
  };
}

export function enumType<T extends string>(values: readonly T[]): Validator<T> {
  return {
    parse: (value: string | undefined) => {
      if (value === undefined || value === "") {
        throw new Error("Missing value");
      }
      if (!values.includes(value as T)) {
        throw new Error(
          `Invalid enum value. Expected one of: ${values.join(", ")}`,
        );
      }
      return value as T;
    },
  };
}

// Rename export to avoid strict keyword conflict
export { enumType as enum };
