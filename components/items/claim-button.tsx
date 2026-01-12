"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useCurrentUser } from "@/lib/auth/get-user-client";
import { Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";

type ItemData = {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  city: string;
  barangay: string;
  status: string;
  created_at: Date;
  claimed_by: string | null;
};
type ClaimButtonProps = {
  data: ItemData;
  isOwner: boolean;
};

export default function ClaimButton({
  data,
  isOwner = false,
}: ClaimButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();
  const [status, setStatus] = useState("idle");

  const handleClaim = async () => {
    if (!user) {
      setOpen(true);
      return;
    }

    const res = await fetch("/api/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_id: data.id,
      }),
    });
    if (res.ok) {
      setStatus("success");
    } else {
      if (res.status === 409) {
        setStatus("duplicate");
      }
      const result = await res.json();
      console.error(result.error);
    }
    router.refresh();
  };

  return (
    <>
      {isOwner ? (
        <>
          {/* Manage Claims Button */}
          {data.status === "available" && (
            <>
              <Button className="w-full relative" asChild>
                <Link href="/requests">
                  <Users className="h-5 w-5" />
                  View Claim Requests
                  {/* {pendingClaimsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingClaimsCount}
                </span>
              )} */}
                </Link>
              </Button>

              {/* Edit & Delete Buttons */}
              <div className="flex gap-2 my-2">
                <Button variant="secondary" className="flex-1" asChild>
                  <Link href={`/items/${data.id}/edit`}>
                    <Edit className="h-5 w-5" />
                    Edit Item
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                  // onClick={handleDelete}
                >
                  <Trash2 className="h-5 w-5" />
                  Delete
                </Button>
              </div>
            </>
          )}

          {/* Status Info for Owner */}
          {data.status === "reserved" && (
            <>
              <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-center">
                <p className="font-medium text-yellow-400">
                  This item is reserved
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Waiting for the claimer to pick up.
                </p>
              </div>
              <Button className="w-full relative my-4" asChild>
                <Link href="/requests?status=approved">
                  <Users className="h-5 w-5" />
                  View Claim Requests
                  {/* {pendingClaimsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingClaimsCount}
                </span>
              )} */}
                </Link>
              </Button>
            </>
          )}

          {data.status === "claimed" && (
            <div className="p-4 rounded-xl bg-green-400/10 border border-green-400/20 text-center">
              <p className="font-medium text-green-400">
                Successfully given away! 🎉
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This item has found a new home.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* For not owner view  */}
          {status === "idle" && data.status === "available" && (
            <Button
              disabled={data.status !== "available"}
              onClick={handleClaim}
              className="w-full font-semibold p-6"
            >
              Request Claim
            </Button>
          )}
          {status === "success" && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
              <p className="font-medium text-success">Request sent!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Owner will review your request.
              </p>
            </div>
          )}
          {data.status === "reserved" && (
            <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-center">
              <p className="font-medium text-yellow-400">
                This item is reserved
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.id === data.claimed_by ? "You" : "Someone has"} already
                reserved this item.
              </p>
            </div>
          )}
          {data.status === "claimed" && (
            <div className="p-4 rounded-xl bg-muted text-center">
              <p className="font-medium text-muted-foreground">
                This item has been claimed
              </p>
            </div>
          )}
          {status === "duplicate" && (
            <div className="p-4 rounded-xl bg-muted text-center">
              <p className="font-medium text-muted-foreground">
                You already claim this item. Please wait for the owner to
                approve.
              </p>
            </div>
          )}
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to claim this item</DialogTitle>
            <div className="flex gap-x-4">
              <Button
                onClick={() => {
                  setOpen(false);
                  router.push(
                    `/login?redirect=${encodeURIComponent(
                      window.location.pathname
                    )}`
                  );
                }}
                className="flex-1"
              >
                Sign in
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  router.push(
                    `/signup?redirect=${encodeURIComponent(
                      window.location.pathname
                    )}`
                  );
                }}
                className="flex-1"
              >
                Sign up
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
