// app/api/generate/notes/route.ts
import { runGeneration } from "@/lib/ai/generate";
import { errorResponse } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const params = await req.json();
    const result = await runGeneration({ type: "notes", params });
    return Response.json({
      ...((result.data as Record<string, unknown>) ?? {}),
      _meta: { creditsSpent: result.creditsSpent, balanceAfter: result.balanceAfter },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
