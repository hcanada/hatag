import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
interface CarouselPhotoProps {
  images: string[];
  title: string;
}

export default function CarouselPhoto({ images, title }: CarouselPhotoProps) {
  return (
    <div className="h-full min-h-0 rounded-xl overflow-hidden bg-secondary/40 ring-1 ring-border/40">
      <Carousel className="h-full">
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem className="relative h-full" key={index}>
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious
              className="absolute left-4 size-10 backdrop-blur-md bg-background/80 border-border/40"
              variant="secondary"
            />
            <CarouselNext
              className="absolute right-4 size-10 backdrop-blur-md bg-background/80 border-border/40"
              variant="secondary"
            />
          </>
        )}
      </Carousel>
    </div>
  );
}
