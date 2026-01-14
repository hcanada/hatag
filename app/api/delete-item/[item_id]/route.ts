import { getCurrentUserNoRedirect } from "@/lib/auth/get-user-server";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { item_id: number } }
) {
  // Handle POST request
  const { item_id } = await params;
  const supabase = await createClient();
  const { status } = await req.json();
  const user = await getCurrentUserNoRedirect();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized, Please log in" },
      { status: 401 }
    );
  }
  const { data: item_data, error: item_error } = await supabase
    .from("items")
    .select("user_id")
    .eq("id", item_id)
    .single();
  if (item_error) {
    return NextResponse.json({ error: item_error.message }, { status: 500 });
  }
  const isOwner = item_data.user_id === user.id;

  if (!isOwner) {
    return NextResponse.json(
      { error: "You are not authorized to delete this item" },
      { status: 403 }
    );
  }

  const { error: claim_error } = await supabase
    .from("claims")
    .update({ status: "rejected", updated_at: new Date() })
    .eq("item_id", item_id);

  if (claim_error) {
    return NextResponse.json({ error: claim_error.message }, { status: 500 });
  }

  const { error } = await supabase
    .from("items")
    .update({ updated_at: new Date(), deleted_at: new Date() })
    .eq("id", item_id)
    .eq("status", status);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // if (status === "available") {
  //   const { error } = await supabase
  //     .from("items")
  //     .update({ deleted_at: new Date() })
  //     .eq("id", item_id)
  //     .eq("status", "available");

  //   if (error) {
  //     return NextResponse.json({ error: error.message }, { status: 500 });
  //   }
  // } else if (status === "reserved") {
  //   const { error } = await supabase
  //     .from("items")
  //     .update({ deleted_at: new Date() })
  //     .eq("id", item_id)
  //     .eq("status", "reserved");

  //   if (error) {
  //     return NextResponse.json({ error: error.message }, { status: 500 });
  //   }
  // }

  // const { error } = await supabase
  //   .from("items")
  //   .update({ deleted_at: new Date() })
  //   .eq("id", item_id)
  //   .eq("status", "available");

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }
  // console.log(data.user_id, user.id, isOwner, "data");

  // const { data: claim_data, error: claim_error } = await supabase
  //   .from("claim")
  //   .select("status")
  //   .eq("id", item_id)
  //   .single();
  // console.log(claim_data, "claimdata");

  return NextResponse.json({ message: "success" }, { status: 200 });
}
