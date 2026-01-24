import Wrapper from "@/components/layout/Wrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requireUser } from "@/lib/auth/get-user-server";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "@/components/ui/status-badge";
import { MapPin } from "lucide-react";
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

  const { data, error } = await supabase
    .from("claims")
    .select("*,items!inner (*),profiles!inner(*)")
    .eq("items.user_id", user.id)
    .eq("status", status)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
  }
  return (
    <main>
      <Wrapper className="max-w-7xl pb-10">
        <div className="my-10">
          <BackButton />
          <h1 className="font-semibold text-xl">Manage Claims</h1>
          <p className="text-muted-foreground text-sm">
            Review and respond to claim requests
          </p>
        </div>
        <Tabs value={status}>
          <TabsList className="w-full ">
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
          <div className="flex flex-col items-center justify-center py-16 text-center mt-10">
            {status === "pending" && (
              <>
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-medium">No pending requests</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When someone requests your items, they&apos;ll appear here
                </p>
              </>
            )}
            {status === "approved" && (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-medium">No approved requests</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Approved claims will show up here
                </p>
              </>
            )}
            {status === "rejected" && (
              <>
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-lg font-medium">No rejected requests</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Rejected claims will show up here
                </p>
              </>
            )}
          </div>
        )}
        {data && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {data.map((claim) => {
              return (
                <div key={claim.id} className="border p-4 rounded-lg bg-muted">
                  <Link
                    href={`/items/${claim.items.id}`}
                    className="space-y-2 flex flex-col hover:underline hover:underline-offset-2 "
                  >
                    <div className="relative h-48 md:h-96 w-full">
                      <Image
                        src={claim.items.images[0]}
                        alt={claim.items.title}
                        fill
                        className="rounded-md object-cover"
                      />
                      <StatusBadge
                        status={claim.status}
                        className="absolute top-2 left-2 "
                      />
                      <span
                        className={
                          "absolute top-2 right-2 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium  border bg-white text-black capitalize"
                        }
                      >
                        {claim.items.category}
                      </span>
                    </div>{" "}
                    <div className="flex gap-2 items-center">
                      <div className="bg-muted-foreground size-10 rounded-full" />
                      <h2 className="font-bold text-xl capitalize">
                        {claim.profiles.first_name} {claim.profiles.last_name}
                      </h2>
                    </div>
                    <h2 className="font-bold text-xl">{claim.items.title}</h2>
                    <div className="flex flex-col text-sm text-muted-foreground mt-auto">
                      <div className=" pb-2 flex justify-between  ">
                        <p className="flex items-center gap-x-1">
                          <MapPin size={15} /> {claim.items.barangay},{" "}
                          {claim.items.city}
                        </p>
                        <p>{getDateFromNow(claim.items.created_at)}</p>
                      </div>
                    </div>
                  </Link>
                  {claim.status === "pending" && (
                    <ApproveRejectButton data={claim} />
                  )}{" "}
                  {claim.status === "approved" &&
                    claim.items.status === "reserved" && (
                      <MarkClaimButton data={claim} />
                    )}
                  {claim.status === "approved" &&
                    claim.items.status === "claimed" && (
                      <div className="py-2 rounded-full bg-green-400/10 border border-green-400/20 text-center">
                        <p className="font-medium text-green-400">
                          Successfully given away! 🎉
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This item has found a new home.
                        </p>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </Wrapper>
    </main>
  );
}
