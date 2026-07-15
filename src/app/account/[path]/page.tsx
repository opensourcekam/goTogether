import { AccountView } from "@neondatabase/auth-ui";
import { accountViewPaths } from "@neondatabase/auth-ui/server";

import { NeonAuthSetupNotice } from "@/components/neon-auth-setup";
import { isNeonAuthConfigured } from "@/lib/auth/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  if (!isNeonAuthConfigured()) {
    return <NeonAuthSetupNotice />;
  }

  const { path } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <AccountView path={path} />
    </main>
  );
}
