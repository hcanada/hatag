import Wrapper from "@/components/layout/Wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      <Wrapper className="max-w-7xl pb-10">
        <div className="my-10">
          <Skeleton className="h-6 w-20 mb-2" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>

        {/* Tabs skeleton */}
        <Skeleton className="h-10 w-full rounded-lg" />

        {/* Cards grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border p-4 rounded-lg bg-muted space-y-4">
              <Skeleton className="h-48 md:h-96 w-full rounded-md" />
              <div className="flex gap-2 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1 rounded-full" />
                <Skeleton className="h-10 flex-1 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </main>
  );
}
