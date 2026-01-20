import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Handle POST request
  const supabase = await createClient();
  const { id, item_id, action } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("items")
    .select("user_id")
    .eq("id", item_id)
    .single();

  if (!data || error) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
  if (data.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  switch (action) {
    case "approved":
      const { error: approveError } = await supabase.rpc(
        "approve_claim_request",
        {
          p_claim_id: id,
          p_item_id: item_id,
        },
      );

      if (approveError) {
        console.error(approveError);
        return NextResponse.json({ approveError }, { status: 500 });
      }

      return NextResponse.json(
        { message: "success", action: "approved" },
        { status: 200 },
      );

    case "rejected":
      const { error: rejectError } = await supabase
        .from("claims")
        .update({ status: action, updated_at: new Date() })
        .eq("id", id)
        .eq("status", "pending");

      if (rejectError) {
        console.error(rejectError);
        return NextResponse.json({ rejectError }, { status: 500 });
      }

      return NextResponse.json(
        { message: "success", action: "rejected" },
        { status: 200 },
      );

    case "claimed":
      const { error: claimedError } = await supabase
        .from("items")
        .update({ status: "claimed", updated_at: new Date() })
        .eq("id", item_id)
        .eq("status", "reserved");

      if (claimedError) {
        console.error(claimedError);
        return NextResponse.json({ claimedError }, { status: 500 });
      }

      return NextResponse.json(
        { message: "success", action: "claimed" },
        { status: 200 },
      );
    case "cancel":
      const { error: cancelError } = await supabase.rpc(
        "mark_claim_cancel_request",
        {
          p_claim_id: id,
          p_item_id: item_id,
        },
      );

      if (cancelError) {
        console.error(cancelError);
        return NextResponse.json({ cancelError }, { status: 500 });
      }

      return NextResponse.json(
        { message: "success", action: "cancel" },
        { status: 200 },
      );

    default:
      return NextResponse.json({ error: "Unexpected Error" }, { status: 500 });
  }
}
