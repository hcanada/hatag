import Wrapper from "@/components/layout/Wrapper";
import { createClient } from "@/lib/supabase/server";
import ItemsList from "@/components/items/items-list";
import { Item } from "@/components/types/item";
// import { SelectScrollable } from "@/components/items/select-filter";
export default async function Items() {
  const supabase = await createClient();
  const { data: item, error: itemError } = await supabase
    .from("items")
    .select("*,profiles(*)")
    .is("deleted_at", null)
    .order("id", { ascending: false });

  const items = item as Item[]; // Cast the data to the Item type

  if (itemError) {
    console.error("Error fetching data:", itemError);
  }

  return (
    <main>
      <Wrapper className="max-w-7xl">
        <div className="flex justify-between my-6">
          <h1 className="font-bold text-xl ">Todays pick</h1>
          {/* <SelectScrollable /> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          <ItemsList data={items} />
        </div>
      </Wrapper>
    </main>
  );
}
