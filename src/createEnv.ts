import { EnvValidationError } from "./errors";
import { InferSchema, Schema } from "./types";

export function createEnv<S extends Schema>(schema: S): InferSchema<S> {
  const issues: { key: string; error: string; value: string | undefined }[] =
    [];
  const result: Partial<InferSchema<S>> = {};

  for (const key of Object.keys(schema)) {
    const validator = schema[key];
    const value = process.env[key];

    try {
      result[key as keyof S] = validator.parse(value);
    } catch (err: any) {
      issues.push({
        key,
        error: err.message || "Unknown error",
        value,
      });
    }
  }

  if (issues.length > 0) {
    throw new EnvValidationError(issues);
  }

  return result as InferSchema<S>;
}
