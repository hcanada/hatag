import Wrapper from "@/components/layout/Wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <Wrapper className="max-w-7xl py-8 md:py-12">
        <div className="space-y-3 mt-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Skeleton className="h-10 w-full rounded-lg mt-8" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-lg overflow-hidden shadow-sm"
            >
              <Skeleton className="h-60 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex justify-between pt-3 border-t border-border/60">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-10 flex-1 rounded-md" />
                  <Skeleton className="h-10 flex-1 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </main>
  );
}
