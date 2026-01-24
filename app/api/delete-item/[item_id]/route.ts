import { getCurrentUser } from "@/lib/auth/get-user-server";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ item_id: string }> },
) {
  // Handle POST request
  const { item_id } = await params;

  const itemId = parseInt(item_id);
  if (isNaN(itemId) || itemId <= 0) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const { status } = await req.json();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized, Please log in" },
      { status: 401 },
    );
  }
  const { data: item_data, error: item_error } = await supabase
    .from("items")
    .select("user_id")
    .eq("id", itemId)
    .single();
  if (item_error) {
    return NextResponse.json({ error: item_error.message }, { status: 500 });
  }
  const isOwner = item_data.user_id === user.id;

  if (!isOwner) {
    return NextResponse.json(
      { error: "You are not authorized to delete this item" },
      { status: 403 },
    );
  }

  const { error: claim_error } = await supabase
    .from("claims")
    .update({ status: "rejected", updated_at: new Date() })
    .eq("item_id", itemId);

  if (claim_error) {
    return NextResponse.json({ error: claim_error.message }, { status: 500 });
  }

  const { error } = await supabase
    .from("items")
    .update({ updated_at: new Date(), deleted_at: new Date() })
    .eq("id", itemId)
    .eq("status", status);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
