import Wrapper from "@/components/layout/Wrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireUser } from "@/lib/auth/get-user-server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "@/components/ui/status-badge";
import { MapPin, Inbox, CheckCircle2, XCircle } from "lucide-react";
import ApproveRejectButton from "@/components/claimrequest/approval-button";
import { getDateFromNow } from "@/lib/date";
import BackButton from "@/components/ui/back-button";
import MarkClaimButton from "@/components/claimrequest/markclaim-button";

type ClaimStatus = "approved" | "rejected" | "pending";

export default async function Request({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = await createClient();
  const user = await requireUser();
  const params = await searchParams;
  const status: ClaimStatus =
    params.status === "approved" || params.status === "rejected"
      ? params.status
      : "pending";

  const { data } = await supabase
    .from("claims")
    .select("*,items!inner (*),profiles!inner(*)")
    .eq("items.user_id", user.id)
    .eq("status", status)
    .order("created_at", { ascending: false });

  return (
    <main>
      <Wrapper className="max-w-7xl py-8 md:py-12">
        <BackButton />
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Your inbox
            </p>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight">
            Claim requests
          </h1>
          <p className="text-muted-foreground">
            Review and respond to neighbors who&apos;d like your items.
          </p>
        </div>

        <Tabs value={status} className="mt-8">
          <TabsList className="w-full">
            <TabsTrigger value="pending" asChild>
              <Link href="/requests?status=pending">Pending</Link>
            </TabsTrigger>
            <TabsTrigger value="approved" asChild>
              <Link href="/requests?status=approved">Approved</Link>
            </TabsTrigger>
            <TabsTrigger value="rejected" asChild>
              <Link href="/requests?status=rejected">Rejected</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center mt-10">
            <div className="h-16 w-16 rounded-full bg-secondary/60 flex items-center justify-center mb-5">
              {status === "pending" && (
                <Inbox className="text-muted-foreground" size={28} />
              )}
              {status === "approved" && (
                <CheckCircle2 className="text-primary" size={28} />
              )}
              {status === "rejected" && (
                <XCircle className="text-muted-foreground" size={28} />
              )}
            </div>
            {status === "pending" && (
              <>
                <h3 className="font-serif text-2xl">Nothing pending</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  When neighbors request your items, their notes land here.
                </p>
              </>
            )}
            {status === "approved" && (
              <>
                <h3 className="font-serif text-2xl">No approved requests</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Approved claims will show up here, ready for handoff.
                </p>
              </>
            )}
            {status === "rejected" && (
              <>
                <h3 className="font-serif text-2xl">No rejected requests</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Politely declined requests are kept here for your records.
                </p>
              </>
            )}
          </div>
        )}

        {data && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {data.map((claim) => {
              return (
                <div
                  key={claim.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm flex flex-col"
                >
                  <Link
                    href={`/items/${claim.items.id}`}
                    className="flex flex-col group"
                  >
                    <div className="relative h-60 w-full overflow-hidden">
                      <Image
                        src={claim.items.images[0]}
                        alt={claim.items.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <StatusBadge
                        status={claim.status}
                        className="absolute top-3 left-3"
                      />
                      <span className="absolute top-3 right-3 flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur-md bg-background/80 text-foreground border border-border/40 capitalize">
                        {claim.items.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col gap-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground capitalize">
                        Requested by {claim.profiles.first_name}{" "}
                        {claim.profiles.last_name}
                      </p>
                      <h3 className="font-serif text-xl leading-tight">
                        {claim.items.title}
                      </h3>
                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/60 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} /> {claim.items.barangay},{" "}
                          {claim.items.city}
                        </span>
                        <span>{getDateFromNow(claim.items.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-5 pb-5">
                    {claim.status === "pending" && (
                      <ApproveRejectButton data={claim} />
                    )}
                    {claim.status === "approved" &&
                      claim.items.status === "reserved" && (
                        <MarkClaimButton data={claim} />
                      )}
                    {claim.status === "approved" &&
                      claim.items.status === "claimed" && (
                        <div className="py-3 px-4 rounded-lg bg-primary/8 border border-primary/20 text-center">
                          <p className="font-serif text-base text-primary">
                            Passed along successfully
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            This item has found a new home.
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Wrapper>
    </main>
  );
}
