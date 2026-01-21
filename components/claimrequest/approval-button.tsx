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
      <div className="w-full flex gap-4">
        <Button
          className="flex-1 rounded-full"
          onClick={() => setOpenApprove(true)}
          disabled={!!loading}
        >
          {loading === "approved" ? "Loading..." : "Approve"}
        </Button>
        <Button
          className="flex-1 rounded-full"
          onClick={() => setOpenReject(true)}
          variant={"secondary"}
          disabled={!!loading}
        >
          {loading === "rejected" ? "Loading..." : "Reject"}
        </Button>
      </div>

      {/* Approve Dialog */}
      <Dialog open={openApprove} onOpenChange={setOpenApprove}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve this claim?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>You are about to approve this claim request.</p>
            <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3">
              <p className="font-medium text-foreground mb-2">This will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Reserve the item for this person</li>
                <li>Automatically reject all other pending requests</li>
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
            <DialogTitle>Reject this claim?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>The requester will be notified that their claim was rejected.</p>
            <p className="font-medium text-foreground">
              Are you sure you want to reject this request?
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant={"destructive"}
              disabled={!!loading}
              onClick={() => {
                setOpenReject(false);
                handleClick("rejected");
              }}
            >
              {loading === "rejected" ? "Loading..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
