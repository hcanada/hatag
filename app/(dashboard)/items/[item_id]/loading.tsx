import Wrapper from "@/components/layout/Wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <Wrapper className="max-w-360 px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: Image skeleton */}
          <Skeleton className="h-96 w-full rounded-lg" />

          {/* RIGHT: Details skeleton */}
          <div className="space-y-4">
            {/* Title */}
            <div className="flex justify-between gap-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Meta */}
            <div className="flex gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Description */}
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Owner card */}
            <div className="mt-6 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>

            {/* Button */}
            <Skeleton className="h-12 w-full rounded-lg mt-6" />
          </div>
        </div>
      </Wrapper>
    </main>
  );
}
