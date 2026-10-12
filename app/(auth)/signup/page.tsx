import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { Suspense } from "react";

export default function Signup() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-secondary/30 to-accent/20 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      </div>
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="font-serif text-3xl tracking-tight flex items-center gap-2 justify-center"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Hatag
        </Link>
        <Suspense fallback={null}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
