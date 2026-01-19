import CarouselPhoto from "@/components/items/carousel-items";
import ClaimButton from "@/components/items/claim-button";
import Wrapper from "@/components/layout/Wrapper";
import SafetyReminder from "@/components/ui/safety-reminder";
import StatusBadge from "@/components/ui/status-badge";
import { getCurrentUserNoRedirect } from "@/lib/auth/get-user-server";
import { formatMonthYear, getDateFromNow } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";
import { MapPin } from "lucide-react";

type Item_id = {
  item_id: string;
};
export default async function Item({ params }: { params: Promise<Item_id> }) {
  const supabase = await createClient();
  const user = await getCurrentUserNoRedirect();

  const { item_id } = await params;
  let isOwner = false;

  const { data, error } = await supabase
    .from("items")
    .select("*,profiles(*),claims(*)")
    .eq("id", item_id)
    .order("id", { referencedTable: "claims", ascending: false })
    .maybeSingle();

  if (error) return <Wrapper className="mt-10">Error fetching item</Wrapper>;
  if (!data) return <Wrapper className="mt-10">Item not found</Wrapper>;
  if (data.deleted_at)
    return <Wrapper className="mt-10">Item is deleted</Wrapper>;

  if (user?.id === data.user_id) isOwner = true;

  return (
    <main>
      {/* Page container */}
      <Wrapper className="max-w-360 px-6 py-6 md:py-10">
        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 ">
          {/* LEFT: Images */}
          <div className="h-96">
            <CarouselPhoto images={data.images} title={data.title} />
          </div>

          {/* RIGHT: Details card */}
          <div>
            <div>
              {/* Title + Status */}
              <div className="flex justify-between gap-4">
                <h1 className="text-2xl font-semibold leading-tight">
                  {data.title}
                </h1>
                <StatusBadge status={data.status} />
              </div>

              {/* Meta */}
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={15} />
                <span>
                  {data.barangay}, {data.city}
                </span>
                <span>•</span>
                <span>Posted {getDateFromNow(data.created_at)}</span>
              </div>

              {/* Description */}
              <div className="mt-6">
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground ">
                  {data.description}
                </p>
              </div>

              {/* Owner card */}
              <div className="mt-6 rounded-lg border -50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <p className="text-sm font-semibold capitalize">
                      {data.profiles.first_name} {data.profiles.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Member since {formatMonthYear(data.profiles.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety reminder */}
              <SafetyReminder />

              {/* Claim section */}
              <div className="mt-6">
                <ClaimButton data={data} isOwner={isOwner} />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
