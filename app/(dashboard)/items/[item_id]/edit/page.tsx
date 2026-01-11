import EditItemForm from "@/components/items/edit-item";
import { createClient } from "@/lib/supabase/server";

type Item_id = {
  item_id: string;
};

export default async function EditItem({
  params,
}: {
  params: Promise<Item_id>;
}) {
  const { item_id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", item_id)
    .single();
  if (error) {
    return;
  }
  return <EditItemForm item={data} />;
}
