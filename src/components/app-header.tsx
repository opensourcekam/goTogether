import Link from "next/link";

import { isNeonAuthConfigured } from "@/lib/auth/config";

export function AppHeader({ title }: { title?: string }) {
  const authReady = isNeonAuthConfigured();

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            goTogether
          </Link>
          {title && (
            <span className="text-muted-foreground hidden text-sm sm:inline">
              {title}
            </span>
          )}
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/discover" className="hover:underline">
            Discover
          </Link>
          <Link href="/onboarding" className="hover:underline">
            Preferences
          </Link>
          {authReady ? (
            <Link href="/account/settings" className="hover:underline">
              Account
            </Link>
          ) : (
            <Link href="/auth/sign-in" className="hover:underline">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
