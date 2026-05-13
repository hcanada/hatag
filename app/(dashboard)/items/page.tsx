import Wrapper from "@/components/layout/Wrapper";
import { createClient } from "@/lib/supabase/server";
import ItemsList from "@/components/items/items-list";
import { Item } from "@/components/types/item";
import { ItemsFilter } from "@/components/items/item-filter";
import { SearchParams } from "@/components/types/search-params";

export default async function Items({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, city, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*,profiles(*)")
    .is("deleted_at", null)
    .order("id", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }
  if (city) {
    query = query.ilike("city", city);
  }
  if (category) {
    query = query.ilike("category", category);
  }

  const { data: item } = await query;

  const items = (item ?? []) as Item[];

  return (
    <main>
      <Wrapper className="max-w-7xl py-12 md:py-16">
        <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Today&apos;s shelf
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              On offer right now
            </h1>
          </div>
          <ItemsFilter />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          <ItemsList data={items} />
        </div>
      </Wrapper>
    </main>
  );
}
