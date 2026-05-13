// lib/errors.ts — typed API errors so routes stay one-liners.

export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "INSUFFICIENT_CREDITS"
  | "RATE_LIMITED"
  | "BAD_REQUEST"
  | "AI_PROVIDER_ERROR"
  | "AI_PARSE_ERROR"
  | "INTERNAL";

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  details?: unknown;

  constructor(code: ApiErrorCode, message: string, status?: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status ?? defaultStatus(code);
    this.details = details;
  }
}

function defaultStatus(code: ApiErrorCode): number {
  switch (code) {
    case "UNAUTHENTICATED": return 401;
    case "INSUFFICIENT_CREDITS": return 402;
    case "RATE_LIMITED": return 429;
    case "BAD_REQUEST": return 400;
    case "AI_PROVIDER_ERROR": return 502;
    case "AI_PARSE_ERROR": return 502;
    case "INTERNAL": return 500;
  }
}

export function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return Response.json(
      { error: err.code, message: err.message, details: err.details ?? null },
      { status: err.status }
    );
  }
  // Surface known Postgres error codes
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("INSUFFICIENT_CREDITS")) {
    return Response.json(
      { error: "INSUFFICIENT_CREDITS", message: "Not enough credits for this generation." },
      { status: 402 }
    );
  }
  if (process.env.NODE_ENV !== "production") {
    return Response.json({ error: "INTERNAL", message }, { status: 500 });
  }
  return Response.json({ error: "INTERNAL", message: "Something went wrong." }, { status: 500 });
}
