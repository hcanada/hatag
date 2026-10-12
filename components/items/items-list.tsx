import Image from "next/image";
import StatusBadge from "../ui/status-badge";
import { MapPin, Package } from "lucide-react";
import Link from "next/link";
import { Item } from "../types/item";
import { getDateFromNow } from "@/lib/date";

export default function ItemsList({ data }: { data: Item[] }) {
  return (
    <>
      {data.map((item) => {
        return (
          <Link
            key={item.id}
            href={`/items/${item.id}`}
            className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-64 md:h-72 w-full overflow-hidden">
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <StatusBadge
                status={item.status}
                className="absolute top-3 left-3"
              />
              <span className="absolute top-3 right-3 flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur-md bg-background/80 text-foreground border border-border/40 capitalize">
                {item.category}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-2 flex-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground capitalize">
                Shared by {item.profiles.first_name} {item.profiles.last_name}
              </p>
              <h3 className="font-serif text-xl leading-tight text-foreground">
                {item.title}
              </h3>
              <div className="flex items-center justify-between pt-3 mt-auto border-t border-border/60 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {item.barangay}, {item.city}
                </span>
                <span>{getDateFromNow(item.created_at)}</span>
              </div>
            </div>
          </Link>
        );
      })}
      {data.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
          <div className="h-14 w-14 rounded-full bg-secondary/60 flex items-center justify-center mb-5">
            <Package className="text-muted-foreground" size={26} />
          </div>
          <h3 className="font-serif text-xl">Nothing here just yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Check back soon — neighbors are always sharing something new.
          </p>
        </div>
      )}
    </>
  );
}
