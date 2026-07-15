import { NextResponse } from "next/server";

import { isNeonAuthConfigured } from "@/lib/auth/config";
import { auth } from "@/lib/auth/server";

const handlers = auth.handler();

function notConfigured() {
  return NextResponse.json(
    {
      error:
        "Neon Auth is not configured. Set NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET in .env (see .env.example).",
    },
    { status: 503 }
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!isNeonAuthConfigured()) return notConfigured();
  return handlers.GET(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!isNeonAuthConfigured()) return notConfigured();
  return handlers.POST(request, context);
}
