import Link from "next/link";
import { Compass, MapPin, Route } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isNeonAuthConfigured } from "@/lib/auth/config";

const highlights = [
  {
    icon: MapPin,
    title: "Set your home base",
    description:
      "Pick where you're starting from, your travel style, and how far you want to roam.",
  },
  {
    icon: Compass,
    title: "Get suggested trips",
    description:
      "A distance-ring engine surfaces destinations that match your vibe within reach.",
  },
  {
    icon: Route,
    title: "Stops on the way",
    description:
      "Every suggestion arrives with prefilled stops and a rough budget, ready to go.",
  },
];

export default function Home() {
  const authReady = isNeonAuthConfigured();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
      <section className="flex flex-col items-start gap-6">
        <span className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          goTogether
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold text-balance sm:text-6xl">
          Get lost on purpose.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg text-pretty">
          Set your home base, style, and range — then get suggested trips with
          prefilled stops on the way. Solo at its core, built for &quot;you and
          me&quot; from day one.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/onboarding">Start planning</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/discover">Browse suggestions</Link>
          </Button>
          {authReady ? (
            <Button asChild size="lg" variant="ghost">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="ghost">
              <Link href="/auth/sign-in">Configure Neon Auth</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="text-muted-foreground size-6" aria-hidden />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Live in this build: preferences, suggestion engine, discover feed,
              and trip detail maps.
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
