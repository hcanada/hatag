import CarouselPhoto from "@/components/items/carousel-items";
import ClaimButton from "@/components/items/claim-button";
import Wrapper from "@/components/layout/Wrapper";
import SafetyReminder from "@/components/ui/safety-reminder";
import StatusBadge from "@/components/ui/status-badge";
import { getCurrentUser } from "@/lib/auth/get-user-server";
import { formatMonthYear, getDateFromNow } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Item_id = {
  item_id: string;
};
export default async function Item({ params }: { params: Promise<Item_id> }) {
  const { item_id } = await params;
  const itemId = parseInt(item_id);
  if (isNaN(itemId) || itemId <= 0) {
    notFound();
  }
  const supabase = await createClient();
  const user = await getCurrentUser();
  let isOwner = false;

  const { data, error } = await supabase
    .from("items")
    .select("*,profiles(*),claims(*)")
    .eq("id", itemId)
    .order("id", { referencedTable: "claims", ascending: false })
    .maybeSingle();

  if (error)
    return (
      <Wrapper className="mt-10 font-serif text-2xl">
        Something went wrong fetching this item.
      </Wrapper>
    );
  if (!data)
    return (
      <Wrapper className="mt-10 font-serif text-2xl">Item not found.</Wrapper>
    );
  if (data.deleted_at)
    return (
      <Wrapper className="mt-10 font-serif text-2xl">
        This item has been removed.
      </Wrapper>
    );

  if (user?.id === data.user_id) isOwner = true;

  return (
    <main>
      <Wrapper className="max-w-7xl py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 h-96 lg:h-[36rem]">
            <CarouselPhoto images={data.images} title={data.title} />
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium capitalize">
                {data.category}
              </span>
              <span className="h-px flex-1 bg-border" />
              <StatusBadge status={data.status} />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] tracking-tight">
              {data.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {data.barangay}, {data.city}
              </span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} />
                Posted {getDateFromNow(data.created_at)}
              </span>
            </div>

            <div className="mt-8">
              <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-3">
                About this item
              </h2>
              <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">
                {data.description}
              </p>
            </div>

            <Link
              href={`/u/${data.profiles.username}`}
              className="group mt-8 rounded-xl bg-secondary/50 hover:bg-secondary p-5 transition-colors"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium mb-3">
                Shared by
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/15 ring-1 ring-primary/20 flex items-center justify-center font-serif text-primary text-lg capitalize">
                  {data.profiles.first_name?.[0]}
                  {data.profiles.last_name?.[0]}
                </div>
                <div>
                  <p className="font-serif text-lg capitalize text-foreground">
                    {data.profiles.first_name} {data.profiles.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Member since {formatMonthYear(data.profiles.created_at)}
                  </p>
                </div>
              </div>
            </Link>

            <SafetyReminder />

            <div className="mt-6">
              <ClaimButton data={data} isOwner={isOwner} />
            </div>
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
