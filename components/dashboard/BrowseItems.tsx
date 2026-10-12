import Link from "next/link";
import Wrapper from "../layout/Wrapper";
import { createClient } from "@/lib/supabase/server";
import ItemsList from "../items/items-list";
import { Item } from "../types/item";
import { ArrowUpRight } from "lucide-react";

export default async function Browse() {
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("items")
    .select("*,profiles(*)")
    .order("id", { ascending: false })
    .is("deleted_at", null)
    .limit(3);
  const items = (item ?? []) as Item[];
  return (
    <section className="py-20 md:py-28">
      <Wrapper>
        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Fresh on the shelf
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              Recently shared
            </h2>
            <p className="text-muted-foreground">
              Treasures passed along by neighbors — all completely free.
            </p>
          </div>
          <Link
            href="/items"
            className="group inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            See everything
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-pretty">
          <ItemsList data={items} />
        </div>
      </Wrapper>
    </section>
  );
}
