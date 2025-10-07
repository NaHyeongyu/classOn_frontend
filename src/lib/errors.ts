export function extractErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message?: string }).message ?? undefined;
  }
  return undefined;
}

export function readableError(error: unknown, fallback: string): string {
  return extractErrorMessage(error) || fallback;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return readableError(error, fallback);
}
