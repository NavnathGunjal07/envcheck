export class EnvValidationError extends Error {
  public issues: { key: string; error: string; value: string | undefined }[];

  constructor(
    issues: { key: string; error: string; value: string | undefined }[],
  ) {
    const message = ["Environment validation failed:"]
      .concat(
        issues.map((i) => `  - ${i.key}: ${i.error} (Received: ${i.value})`),
      )
      .join("\n");

    super(message);
    this.name = "EnvValidationError";
    this.issues = issues;
  }
}
