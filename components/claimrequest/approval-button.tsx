"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { toast } from "sonner";
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
export default function ApproveRejectButton({
  data,
}: ApproveRejectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const handleClick = async (action: string) => {
    if (loading) return;
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

      if (result.action === "approved") {
        toast.success("Request Approved!", {
          description:
            "The requester has been notified. Other pending requests for this item have been rejected",
          duration: 5000,
        });
      } else if (result.action === "rejected") {
        toast.error("Request Rejected!", {
          description: "The requester has been notified",
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
          onClick={() => setOpenApprove(true)}
          disabled={!!loading}
        >
          {loading === "approved" ? "Loading..." : "Approve"}
        </Button>
        <Button
          className="flex-1"
          onClick={() => setOpenReject(true)}
          variant="outline"
          disabled={!!loading}
        >
          {loading === "rejected" ? "Loading..." : "Reject"}
        </Button>
      </div>

      {/* Approve Dialog */}
      <Dialog open={openApprove} onOpenChange={setOpenApprove}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Approve this claim?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>You&apos;re about to approve this claim request.</p>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="font-medium text-foreground mb-2">This will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Reserve the item for this neighbor</li>
                <li>Politely decline all other pending requests</li>
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
                setOpenApprove(false);
                handleClick("approved");
              }}
            >
              {loading === "approved" ? "Loading..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              Decline this claim?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>The neighbor will be notified that their claim was declined.</p>
            <p className="font-medium text-foreground">
              Are you sure you want to decline this request?
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={!!loading}
              onClick={() => {
                setOpenReject(false);
                handleClick("rejected");
              }}
            >
              {loading === "rejected" ? "Loading..." : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
