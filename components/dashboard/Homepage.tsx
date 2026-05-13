import Link from "next/link";
import Wrapper from "../layout/Wrapper";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function Homepage() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
      >
        <div className="absolute top-20 -left-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <Wrapper className="py-24 md:py-36">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8 space-y-6 text-pretty">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                A community archive
              </p>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
              Give &amp; receive
              <br />
              <span className="italic text-primary">freely</span> in your
              neighborhood.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Hatag is a quiet bulletin board for the things you no longer need
              — passed along, not thrown away. Less waste, more neighbors.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
            <Link href="/upload" className="w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto group">
                Post an item
                <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/items" className="w-full md:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full md:w-auto"
              >
                Browse the shelves
              </Button>
            </Link>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
