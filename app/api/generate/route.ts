// app/api/generate/route.ts — assessment generation (default).
// Kept for backward compatibility; new code should prefer typed endpoints.
import { runGeneration } from "@/lib/ai/generate";
import { errorResponse, ApiError } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type = "assessment", ...params } = body;

    if (type !== "assessment" && type !== "notes" && type !== "lesson_plan") {
      throw new ApiError("BAD_REQUEST", `Unknown generation type: ${type}`);
    }

    const result = await runGeneration({ type, params });
    return Response.json({
      ...((result.data as Record<string, unknown>) ?? {}),
      _meta: { creditsSpent: result.creditsSpent, balanceAfter: result.balanceAfter },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
