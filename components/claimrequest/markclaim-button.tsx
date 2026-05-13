"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Claim } from "../types/item";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface ApproveRejectButtonProps {
  data: Claim;
}
export default function MarkClaimButton({ data }: ApproveRejectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [openClaimed, setOpenClaimed] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const handleClick = async (action: string) => {
    setLoading(action);
    const res = await fetch("/api/requestclaim", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: data.id,
        item_id: data.items.id,
        action,
      }),
    });

    if (res.ok) {
      const result = await res.json();

      if (result.action === "claimed") {
        toast.success("Item marked as claimed", {
          duration: 5000,
        });
      } else if (result.action === "cancel") {
        toast.error("Reservation cancelled", {
          description: "Item is available again",
          duration: 5000,
        });
      } else {
        toast.warning("Something went wrong!", {
          duration: 5000,
        });
      }
      setLoading("");
      router.refresh();
    } else {
      const result = await res.json();
      toast.error(result.error, {
        duration: 5000,
      });
      setLoading("");
    }
  };

  return (
    <>
      <div className="w-full flex gap-3">
        <Button
          className="flex-1"
          onClick={() => setOpenClaimed(true)}
          disabled={!!loading}
        >
          {loading === "claimed" ? "Loading..." : "Mark as claimed"}
        </Button>
        <Button
          className="flex-1"
          onClick={() => setOpenCancel(true)}
          variant="outline"
          disabled={!!loading}
        >
          {loading === "cancel" ? "Loading..." : "Cancel reservation"}
        </Button>
      </div>

      {/* Mark as Claimed Dialog */}
      <Dialog open={openClaimed} onOpenChange={setOpenClaimed}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Pass it on?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Confirm that the item has been handed over to the neighbor.</p>
            <div className="rounded-lg border border-accent/40 bg-accent/20 p-4">
              <p className="font-medium text-foreground mb-2">This will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mark the item as successfully shared</li>
                <li>Complete the exchange</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={!!loading}
              onClick={() => {
                setOpenClaimed(false);
                handleClick("claimed");
              }}
            >
              {loading === "claimed" ? "Loading..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Reservation Dialog */}
      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Cancel this reservation?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>The approved claimer will lose their reservation.</p>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="font-medium text-foreground mb-2">This will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make the item available again</li>
                <li>Decline the current reservation</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep reservation</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={!!loading}
              onClick={() => {
                setOpenCancel(false);
                handleClick("cancel");
              }}
            >
              {loading === "cancel" ? "Loading..." : "Cancel reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
