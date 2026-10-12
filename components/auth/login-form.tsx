"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const router = useRouter();
  const redirectParam = searchParams.get("redirect");

  const redirectTo =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.warning(error.message);
      console.error(error.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="font-serif text-3xl tracking-tight">
            Welcome back
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to continue sharing with your neighbors.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  placeholder="your@email.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Sign in</Button>
                <Button variant="outline" type="button">
                  Forgot password
                </Button>
                <FieldDescription className="text-center">
                  New to Hatag?{" "}
                  <Link
                    href="/signup"
                    className="text-primary font-medium hover:underline underline-offset-4"
                  >
                    Create an account
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
