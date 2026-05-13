import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
type DialogAuthProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DialogAuth({ open, setOpen }: DialogAuthProps) {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="space-y-3">
          <DialogTitle className="font-serif text-2xl leading-tight">
            Sign in to claim this item
          </DialogTitle>
          <DialogDescription>
            Join the neighborhood to send a claim request to the owner.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              router.push(
                `/signup?redirect=${encodeURIComponent(
                  window.location.pathname,
                )}`,
              );
            }}
            className="flex-1"
          >
            Create account
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              router.push(
                `/login?redirect=${encodeURIComponent(
                  window.location.pathname,
                )}`,
              );
            }}
            className="flex-1"
          >
            Sign in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
