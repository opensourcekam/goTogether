import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Shown on auth pages when Neon Auth env vars are missing or placeholders. */
export function NeonAuthSetupNotice() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Configure Neon Auth
        </h1>
        <p className="text-muted-foreground text-pretty">
          Auth is not wired yet. In the Neon Console go to{" "}
          <span className="text-foreground font-medium">
            Project → Branch → Auth → Configuration
          </span>
          , enable Auth if needed, then copy your Auth URL into{" "}
          <code className="bg-secondary rounded px-1.5 py-0.5 text-sm">
            .env
          </code>
          :
        </p>
      </div>
      <pre className="bg-secondary overflow-x-auto rounded-lg p-4 text-sm">
        {`NEON_AUTH_BASE_URL=https://ep-….neonauth….neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=$(openssl rand -base64 32)`}
      </pre>
      <p className="text-muted-foreground text-sm text-pretty">
        Enable Google / Facebook (or email OTP) under Auth methods in the
        console, restart <code className="text-xs">pnpm dev</code>, then return
        here to sign in.
      </p>
      <Button asChild variant="outline" className="w-fit">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
