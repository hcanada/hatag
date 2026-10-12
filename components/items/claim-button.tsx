"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCurrentUser } from "@/lib/auth/get-user-client";
import { Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";
import DialogAuth from "../auth/dialog-auth-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Item } from "../types/item";

type ClaimButtonProps = {
  data: Item;
  isOwner: boolean;
};

export default function ClaimButton({
  data,
  isOwner = false,
}: ClaimButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const user = useCurrentUser();
  const [status, setStatus] = useState("idle");
  const pendingCount = (data.claims || []).filter(
    (i) => i.status === "pending",
  ).length;

  const handleDelete = async () => {
    const res = await fetch(`/api/delete-item/${data.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      if (data.status === "available") {
        toast.success("Item deleted. Pending requests were cancelled.");
      } else {
        toast.success("Item deleted. The reserved request was cancelled.");
      }
      router.refresh();
    } else {
      toast.warning("Something went wrong!", {
        duration: 5000,
      });
    }
  };

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
      const result = await res.json();
      console.error(result.error);
      toast.error(result.error, {
        duration: 5000,
      });
    }
    router.refresh();
  };
  return (
    <>
      {isOwner ? (
        <>
          {data.status === "available" && (
            <>
              <Button className="w-full relative" size="lg" asChild>
                <Link href="/requests">
                  <Users className="h-5 w-5" />
                  View claim requests
                  {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              </Button>

              <div className="flex gap-2 mt-3">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/items/${data.id}/edit`}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                  onClick={() => setOpenDelete(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </>
          )}

          {data.status === "reserved" && (
            <>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                <p className="font-serif text-lg text-amber-700 dark:text-amber-400">
                  This item is reserved
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Waiting for the neighbor to pick up.
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <Button className="relative" size="lg" asChild>
                  <Link href="/requests?status=approved">
                    <Users className="h-5 w-5" />
                    View claim requests
                    {pendingCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                  onClick={() => setOpenDelete(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </>
          )}

          {data.status === "claimed" && (
            <div className="p-5 rounded-lg bg-primary/8 border border-primary/20 text-center">
              <p className="font-serif text-lg text-primary">
                Passed along successfully
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This item has found a new home.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {status === "idle" &&
            data.status === "available" &&
            data.claims[0]?.status !== "pending" && (
              <Button
                disabled={data.status !== "available"}
                onClick={handleClaim}
                size="lg"
                className="w-full"
              >
                Request to claim
              </Button>
            )}
          {status === "success" && (
            <div className="p-5 rounded-lg bg-primary/8 border border-primary/20 text-center">
              <p className="font-serif text-lg text-primary">Request sent</p>
              <p className="text-sm text-muted-foreground mt-1">
                The owner will review your request.
              </p>
            </div>
          )}
          {data.status === "reserved" && (
            <div className="p-5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
              <p className="font-serif text-lg text-amber-700 dark:text-amber-400">
                Already reserved
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.id === data.claimed_by
                  ? "You've reserved this item."
                  : "Another neighbor has reserved this item."}
              </p>
            </div>
          )}
          {data.status === "claimed" && (
            <div className="p-5 rounded-lg bg-secondary/50 text-center">
              <p className="font-serif text-lg text-muted-foreground">
                This item has found its home
              </p>
            </div>
          )}
          {data.claims[0]?.status === "pending" && status !== "success" && (
            <div className="p-5 rounded-lg bg-secondary/50 text-center">
              <p className="text-sm text-muted-foreground">
                You&apos;ve already requested this item. Please wait for the
                owner to respond.
              </p>
            </div>
          )}
        </>
      )}
      <DialogAuth open={open} setOpen={setOpen} />
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {data.status === "available"
                ? "Delete this item?"
                : "Delete reserved item?"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm text-muted-foreground">
            {data.status === "available" ? (
              <p>This item may have pending requests.</p>
            ) : (
              <p>This item is currently marked as reserved.</p>
            )}

            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <p className="font-medium text-foreground mb-2">
                Deleting it will:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Cancel all claim requests</li>
                <li>Remove the item from public view</li>
              </ul>
            </div>

            <p className="font-medium text-destructive">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => {
                setOpenDelete(false);
                handleDelete();
              }}
            >
              Confirm delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
