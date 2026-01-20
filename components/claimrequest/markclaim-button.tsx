"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Claim } from "../types/item";

interface ApproveRejectButtonProps {
  data: Claim;
}
export default function MarkClaimButton({ data }: ApproveRejectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState("");

  const handleClick = async (action: string) => {
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
    }
  };
  return (
    <div className="w-full flex gap-4">
      <Button
        className="flex-1 rounded-full"
        onClick={() => handleClick("claimed")}
      >
        Mark as Claimed
      </Button>
      <Button
        className="flex-1 rounded-full"
        onClick={() => handleClick("cancel")}
        variant={"secondary"}
      >
        Cancel Reservation
      </Button>
    </div>
  );
}
