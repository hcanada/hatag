import { ItemsFilter } from "@/components/items/item-filter";
import ItemsList from "@/components/items/items-list";
import Wrapper from "@/components/layout/Wrapper";
import { getCurrentUser } from "@/lib/auth/get-user-server";
import { formatMonthYear } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";

export default async function PublicProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (profileError) {
    return (
      <Wrapper className="max-w-7xl mt-10 font-serif text-2xl">
        Something went wrong.
      </Wrapper>
    );
  }

  if (!profileData) {
    return (
      <Wrapper className="max-w-7xl mt-10 font-serif text-2xl">
        User not found.
      </Wrapper>
    );
  }

  const user = await getCurrentUser();

  const isOwner = user?.id === profileData.id;

  const [
    { data: itemsData, error: itemsError },
    { data: claimData, error: claimError },
  ] = await Promise.all([
    supabase
      .from("items")
      .select("*,profiles(*)")
      .eq("user_id", profileData.id)
      .is("deleted_at", null),
    isOwner
      ? supabase
          .from("claims")
          .select("id, items!inner(user_id)")
          .neq("status", "rejected")
          .neq("items.status", "claimed")
          .eq("items.user_id", profileData.id)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (itemsError || claimError) {
    return (
      <Wrapper className="max-w-7xl mt-10 font-serif text-2xl">
        Something went wrong.
      </Wrapper>
    );
  }

  const claimCount = claimData?.length ?? 0;

  return (
    <main>
      <Wrapper className="max-w-7xl py-10 md:py-16">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-10 border-b border-border/60">
          <div className="md:col-span-3 flex justify-center md:justify-start">
            <div className="size-28 md:size-40 rounded-full bg-primary/15 ring-2 ring-primary/20 flex items-center justify-center font-serif text-primary text-4xl md:text-5xl capitalize">
              {profileData.first_name?.[0]}
              {profileData.last_name?.[0]}
            </div>
          </div>
          <div className="md:col-span-9 space-y-3 text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Neighbor
            </p>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight capitalize">
              {profileData.first_name} {profileData.last_name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Member since {formatMonthYear(profileData.created_at)}
            </p>
          </div>
        </section>

        {isOwner && (
          <Link href="/requests" className="block mt-8 group">
            <div className="flex justify-between items-center rounded-xl border border-primary/20 bg-primary/5 p-5 hover:bg-primary/10 transition-colors">
              <div>
                <p className="font-serif text-lg text-primary">
                  Manage claim requests
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review and respond to neighbors&apos; requests
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">
                  {claimCount} pending
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </div>
          </Link>
        )}

        <section className="mt-12">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Their contributions
                </p>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                Items shared
              </h2>
            </div>
            <ItemsFilter />
          </div>
          {itemsData && itemsData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
              <ItemsList data={itemsData} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-full bg-secondary/60 flex items-center justify-center mb-5">
                <Package className="text-muted-foreground" size={26} />
              </div>
              <h3 className="font-serif text-2xl">
                {isOwner ? "Your shelf is empty" : "Nothing shared yet"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {isOwner
                  ? "Start sharing items with your community."
                  : "This neighbor hasn't shared anything just yet."}
              </p>
            </div>
          )}
        </section>
      </Wrapper>
    </main>
  );
}
