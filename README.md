# envcheck 🛡️

A zero-dependency, tree-shakeable, strongly typed environment variable validator for TypeScript.

`envcheck` allows you to define a schema for your environment variables and guarantees that your app only starts if all variables are correct. It infers types automatically, returning a 100% type-safe config object context.

## Features

- **Zero dependencies** (lightweight)
- **Aggregated Error Reporting** (shows _all_ missing/invalid variables at once)
- **TypeScript First** (perfect type inference)
- **ESM + CJS Support**
- **Tree-shakeable**

## Installation

```bash
npm install envcheck
```

## Basic Usage

```ts
import { createEnv, string, number, boolean, enumType } from "envcheck";

// Define your schema and load variables from process.env
const env = createEnv({
  PORT: number(),
  DATABASE_URL: string(),
  NODE_ENV: enumType(["development", "production", "test"] as const),
  DEBUG: boolean(),
});

// `env` is now fully typed!
//
// const env: {
//   PORT: number;
//   DATABASE_URL: string;
//   NODE_ENV: "development" | "production" | "test";
//   DEBUG: boolean;
// }

console.log(`Server running on port ${env.PORT}`);
```

## How It Works

`createEnv` checks `process.env` against your schema on startup. If any keys are missing or invalid, it throws an `EnvValidationError` containing a list of **all** validation failures, preventing your application from starting in a broken and unpredictable state.

Example error output if variables are missing:

```
EnvValidationError: Environment validation failed:
  - PORT: Missing value (Received: undefined)
  - DATABASE_URL: Missing or empty string (Received: undefined)
  - NODE_ENV: Invalid enum value. Expected one of: development, production, test (Received: staging)
```

## Validators

- `string()`: Ensures the variable exists and is a non-empty string.
- `number()`: Parses the variable into a JavaScript Number. Throws if invalid.
- `boolean()`: Parses `"true"`, `"1"`, `"false"`, or `"0"` into a boolean.
- `enumType(values)`: Acts as an exact string literal matcher. Must pass a `readonly` array (`as const`) for correct type inference.

**Note on standard JS module exports**: If you prefer, `enumType` is also exported as `enum` using named exports, allowing you to use it conditionally or via alias, although `enum` is a reserved word in strict TS block scope.
