import { AuthView } from "@neondatabase/auth-ui";
import { authViewPaths } from "@neondatabase/auth-ui/server";

import { NeonAuthSetupNotice } from "@/components/neon-auth-setup";
import { isNeonAuthConfigured } from "@/lib/auth/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  if (!isNeonAuthConfigured()) {
    return <NeonAuthSetupNotice />;
  }

  const { path } = await params;

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center p-6">
      <AuthView path={path} />
    </main>
  );
}
