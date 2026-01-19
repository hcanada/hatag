"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Claim } from "../types/item";

interface ApproveRejectButtonProps {
  data: Claim;
}
export default function ApproveRejectButton({
  data,
}: ApproveRejectButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState("");

  const handleClick = async (action: string) => {
    if (loading) return; // prevent double click
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
    }
  };
  return (
    <div className="w-full flex gap-4">
      <Button
        className="flex-1 rounded-full"
        onClick={() => handleClick("approved")}
        disabled={!!loading}
      >
        {loading === "approved" ? "Loading..." : "Approve"}
      </Button>
      <Button
        className="flex-1 rounded-full"
        onClick={() => handleClick("rejected")}
        variant={"secondary"}
        disabled={!!loading}
      >
        {loading === "rejected" ? "Loading..." : "Reject"}
      </Button>
    </div>
  );
}
