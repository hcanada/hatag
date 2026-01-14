import {
  Dialog,
  DialogContent,
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
  );
}
