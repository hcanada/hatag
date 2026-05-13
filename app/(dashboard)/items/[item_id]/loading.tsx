import Wrapper from "@/components/layout/Wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <Wrapper className="max-w-7xl py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <Skeleton className="lg:col-span-7 h-96 lg:h-[36rem] w-full rounded-xl" />

          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            <Skeleton className="h-12 w-3/4" />

            <div className="flex gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="rounded-xl bg-secondary/50 p-5">
              <Skeleton className="h-3 w-20 mb-3" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>

            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
