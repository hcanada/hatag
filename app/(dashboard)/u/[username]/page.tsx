import { ItemsFilter } from "@/components/items/item-filter";
import ItemsList from "@/components/items/items-list";
import Wrapper from "@/components/layout/Wrapper";
import { getCurrentUser } from "@/lib/auth/get-user-server";
import { formatMonthYear } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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
    return <Wrapper className="max-w-7xl mt-10">Something went wrong</Wrapper>;
  }

  if (!profileData) {
    return <Wrapper className="max-w-7xl mt-10">User not found</Wrapper>;
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
    return <Wrapper className="max-w-7xl mt-10">Something went wrong</Wrapper>;
  }

  const claimCount = claimData?.length ?? 0;

  return (
    <main>
      <Wrapper className="max-w-7xl mt-10">
        <section className="flex items-center space-x-6 pb-6 md:pb-10 border-b">
          <div className="size-20 md:size-40 bg-accent-foreground rounded-full" />
          <div>
            <h2 className="font-semibold text-2xl md:text-3xl capitalize">
              {profileData.first_name} {profileData.last_name}
            </h2>
            <div className="flex space-x-4 text-muted-foreground text-sm md:text-md">
              {/* temporary */}
              {profileData.city && <p>profileData.city</p>}
              {/* temporary */}
              <p>Member since {formatMonthYear(profileData.created_at)}</p>
            </div>
          </div>
        </section>
        {isOwner && (
          <Link href={"/requests"}>
            <div className="flex justify-between items-center mt-6 rounded-lg border p-4 text-sm text-green-700 dark:text-green-400">
              <div>
                <p className="font-semibold">Manage Claim Request</p>
                <p className="mt-1 text-xs">Review and respond to claims</p>
              </div>
              <div>{claimCount} Pending</div>
            </div>
          </Link>
        )}

        <section>
          <div className="flex justify-between my-6">
            <h1 className="font-semibold text-xl md:text-3xl my-4 md:my-6">
              Items shared
            </h1>
            <ItemsFilter />
          </div>
          <div className="grid md:grid-cols-3 gap-6 pb-10">
            <ItemsList data={itemsData} />
          </div>
        </section>
      </Wrapper>
    </main>
  );
}
