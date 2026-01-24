import Image from "next/image";
import StatusBadge from "../ui/status-badge";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Item } from "../types/item";
import { getDateFromNow } from "@/lib/date";

export default function ItemsList({ data }: { data: Item[] }) {
  return (
    <>
      {data.map((item) => {
        return (
          <div key={item.id} className="border p-4 rounded-lg bg-muted">
            <Link
              href={`/items/${item.id}`}
              className="space-y-2 flex flex-col hover:underline hover:underline-offset-2 "
            >
              <div className="relative h-48 md:h-96 w-full">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="rounded-md object-cover"
                />
                <StatusBadge
                  status={item.status}
                  className="absolute top-2 left-2 "
                />
                <span
                  className={
                    "absolute top-2 right-2 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium  border bg-white text-black capitalize"
                  }
                >
                  {item.category}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="bg-muted-foreground size-10 rounded-full" />
                <h2 className="font-bold text-xl capitalize">
                  {item.profiles.first_name} {item.profiles.last_name}
                </h2>
              </div>
              <h2 className="font-semibold text-xl">{item.title}</h2>
              <div className="flex flex-col text-sm text-muted-foreground mt-auto">
                <div className=" pb-2 flex justify-between  ">
                  <p className="flex items-center gap-x-1">
                    <MapPin size={15} /> {item.barangay}, {item.city}
                  </p>
                  <p>{getDateFromNow(item.created_at)}</p>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
      {data.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Check back later for new items
          </p>
        </div>
      )}
    </>
  );
}
