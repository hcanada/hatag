import Link from "next/link";
import { Button } from "../ui/button";
import NavBarMenu from "./NavBarMenu";
import { createClient } from "@/lib/supabase/server";

export default async function NavBar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id)
    .single();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="w-full flex h-18 justify-between items-center px-6 md:px-10 lg:px-16">
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-foreground flex items-center gap-2"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Hatag
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/items"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/upload"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Share
          </Link>
        </div>

        {user && data ? (
          <NavBarMenu data={data} />
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
