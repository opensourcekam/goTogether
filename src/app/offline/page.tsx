import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline · goTogether",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="text-muted-foreground max-w-sm">
        goTogether can&apos;t reach the network right now. Your saved trips will
        be here when you&apos;re back online.
      </p>
    </main>
  );
}
