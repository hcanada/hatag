import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/@")) {
    const username = request.nextUrl.pathname.slice(2); // Remove /@
    return NextResponse.rewrite(new URL(`/u/${username}`, request.url));
  }
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          ),
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🚫 If logged in, block /login and /register
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const protectedPaths = ["/upload", "/requests"];
  const isEditRoute = request.nextUrl.pathname.match(/^\/items\/\d+\/edit$/);

  // If not logged in and trying to access upload
  if (
    !user &&
    (protectedPaths.includes(request.nextUrl.pathname) || isEditRoute)
  ) {
    const loginUrl = new URL("/login", request.url);

    // 👇 remember where they came from
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/upload",
    "/requests",
    "/items/:id/edit",
    "/login",
    "/signup",
    "/([@].*)",
  ],
};
