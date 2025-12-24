import Link from "next/link";
import { Button } from "../ui/button";
import NavBarMenu from "./NavBarMenu";
import { createClient } from "@/lib/supabase/server";

export default async function NavBar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Current user:", user);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-[#18191A] backdrop-blur-sm">
      <nav className="w-full flex h-16 justify-between items-center px-4 md:px-8 lg:px-16">
        <Link href="/" className="text-green-500 font-bold text-xl">
          Hatag{" "}
        </Link>

        <div className="hidden md:flex">
          <Link href="/">
            <Button variant={"link"}>Home</Button>
          </Link>
          <Link href="/items">
            <Button variant={"link"}>Browse Items</Button>
          </Link>
          <Link href="/upload">
            <Button variant={"link"}>Post Items</Button>
          </Link>
        </div>

        {user ? (
          <NavBarMenu />
        ) : (
          <div className="flex gap-x-2">
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
            <Link href="/signup">
              <Button variant={"secondary"}>Signup</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
