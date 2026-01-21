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
      <div className="w-full flex gap-4">
        <Button
          className="flex-1 rounded-full"
          onClick={() => setOpenClaimed(true)}
          disabled={!!loading}
        >
          {loading === "claimed" ? "Loading..." : "Mark as Claimed"}
        </Button>
        <Button
          className="flex-1 rounded-full"
          onClick={() => setOpenCancel(true)}
          variant={"secondary"}
          disabled={!!loading}
        >
          {loading === "cancel" ? "Loading..." : "Cancel Reservation"}
        </Button>
      </div>

      {/* Mark as Claimed Dialog */}
      <Dialog open={openClaimed} onOpenChange={setOpenClaimed}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as claimed?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Confirm that the item has been handed over to the claimer.</p>
            <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3">
              <p className="font-medium text-foreground mb-2">This will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mark the item as successfully given away</li>
                <li>Complete the transaction</li>
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
            <DialogTitle>Cancel this reservation?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>The approved claimer will lose their reservation.</p>
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3">
              <p className="font-medium text-foreground mb-2">This will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make the item available again</li>
                <li>Reject the current reservation</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep Reservation</Button>
            </DialogClose>
            <Button
              variant={"destructive"}
              disabled={!!loading}
              onClick={() => {
                setOpenCancel(false);
                handleClick("cancel");
              }}
            >
              {loading === "cancel" ? "Loading..." : "Cancel Reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
