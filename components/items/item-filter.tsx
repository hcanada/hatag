// components/items-filter.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

const CITIES = ["Seattle", "Portland", "Denver", "Austin", "Chicago"];
const CATEGORIES = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Books",
  "Toys",
  "Other",
];

export function ItemsFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    city: searchParams.get("city") || "",
    category: searchParams.get("category") || "",
  });

  const activeFilterCount = [filters.city, filters.category].filter(
    Boolean,
  ).length;

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.city) params.set("city", filters.city);
    if (filters.category) params.set("category", filters.category);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
    setOpen(false);
  };

  const clearFilters = () => {
    setFilters({ q: "", city: "", category: "" });
    startTransition(() => {
      router.push(`${pathname}`);
    });
    setOpen(false);
  };

  return (
    <div className="space-y-3 flex flex-row items-center">
      {/* Search Bar - Always Visible */}
      <div className="relative hidden md:block mx-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for items..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="pl-11 bg-secondary/60 border border-border/40 rounded-md text-sm h-9"
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-3">
        <Select
          value={filters.city}
          onValueChange={(value) => setFilters({ ...filters, city: value })}
        >
          <SelectTrigger className="w-32.5 bg-secondary/60 border border-border/40 rounded-md text-sm h-9">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city.toLowerCase()}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger className="w-35 bg-secondary/60 border border-border/40 rounded-md text-sm h-9">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          {(filters.q || filters.city || filters.category) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="rounded-md text-xs h-9 px-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}

          <Button
            onClick={applyFilters}
            disabled={isPending}
            size="sm"
            className="rounded-md h-9 px-5"
          >
            {isPending ? "..." : "Apply"}
          </Button>
        </div>
      </div>

      {/* Mobile Filter Button + Sheet */}
      <div className="flex md:hidden items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-md h-9 px-4 bg-secondary/60 border-border/40"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-xl p-4">
            <SheetHeader className="text-left">
              <SheetTitle className="font-serif text-2xl">Filters</SheetTitle>
            </SheetHeader>

            <div className="space-y-4 pb-6  ">
              {/* Search */}
              <div className="relative ">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for items..."
                  value={filters.q}
                  onChange={(e) =>
                    setFilters({ ...filters, q: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                  className="pl-11 bg-secondary/60 border border-border/40 rounded-md text-sm"
                />
              </div>
              {/* City */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  City
                </label>
                <Select
                  value={filters.city}
                  onValueChange={(value) =>
                    setFilters({ ...filters, city: value })
                  }
                >
                  <SelectTrigger className="w-full bg-secondary/60 border border-border/40 rounded-md h-11">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city.toLowerCase()}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters({ ...filters, category: value })
                  }
                >
                  <SelectTrigger className="w-full bg-secondary/60 border border-border/40 rounded-md h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SheetFooter className="flex flex-row gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1 rounded-md h-11"
              >
                Clear all
              </Button>
              <Button
                onClick={applyFilters}
                disabled={isPending}
                className="flex-1 rounded-md h-11"
              >
                {isPending ? "Applying..." : `Show results`}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Quick clear on mobile */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="rounded-md h-9 px-3 text-muted-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
