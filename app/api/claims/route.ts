import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Handle POST request
  const { item_id } = await req.json();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized, Please log in" },
      { status: 401 }
    );
  }

  const { error } = await supabase
    .from("claims")
    .insert({ item_id, user_id: user.id, status: "pending" });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        {
          error:
            "You already claim this item. Please wait for the owner to approve.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
