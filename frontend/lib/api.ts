import type { Profile } from "./scoring";
import type { Report } from "./interpret";
import { INSTRUMENT_VERSION } from "./instrument";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface LlmReport extends Report {
  source?: string;
}

/** Send a scored profile to the FastAPI LLM narrative endpoint. */
export async function fetchLlmReport(profile: Profile): Promise<LlmReport> {
  const response = await fetch(`${API_BASE}/api/v1/assessment/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instrument_version: INSTRUMENT_VERSION,
      domains: profile.domains,
      qualitative: profile.qualitative,
    }),
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new ApiError(detail, response.status);
  }

  return (await response.json()) as LlmReport;
}
