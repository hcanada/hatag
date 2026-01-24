import EditItemForm from "@/components/items/edit-item";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

type Item_id = {
  item_id: string;
};

export default async function EditItem({
  params,
}: {
  params: Promise<Item_id>;
}) {
  const { item_id } = await params;
  const itemId = parseInt(item_id);
  if (isNaN(itemId) || itemId <= 0) {
    notFound();
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", item_id)
    .single();

  if (error) {
    redirect(`/`);
  }

  if (data.user_id !== user.id) {
    redirect(`/items/${item_id}`);
  }
  return <EditItemForm item={data} />;
}
