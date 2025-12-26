import Wrapper from "@/components/layout/Wrapper";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

// const items = [
//   {
//     id: 1,
//     image:
//       "https://i5.walmartimages.com/seo/Churanty-Farmhouse-5-Piece-Kitchen-Dining-Table-Set-4-Solid-Wood-Extendable-Round-Dining-Table-Set-4-Upholstered-Chairs-Retro-Functional-Dining-Set-K_2493f543-591c-4964-997c-0537d1b43631.02acc04f55d701594c348f8efee810c8.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
//     title: "Wooden dining table with four chairs",
//     description: "Solid oak, good condition, seats four comfortably.  ",
//     location: "Cebu",
//   },
//   {
//     id: 2,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkFNcCKs8RXyuC-9g1qwSyH0gtIxYCteEMoQ&s",
//     title: "Vintage desk lamp with brass base",
//     description:
//       "Works perfectly, warm light, adds character to any workspace.",
//     location: "Manila",
//   },
//   {
//     id: 3,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr_gZ66wEGjOjUuM7yBxGkUb2pMPa76er06Q&s",
//     title: "Collection of fiction novels and cookbooks",
//     description:
//       "Thirty books total, various genres, all in readable condition.",
//     location: "Simala",
//   },
//   {
//     id: 4,
//     image:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_WmV0VEC16HDfULa8eoYGjIzn8WyDSxknQQ&s",
//     title: "Set of ceramic dinnerware for four",
//     description:
//       "Includes plates, bowls, and mugs. Minimalist design, great for everyday use.",
//     location: "Davao",
//   },
//   {
//     id: 5,

//     image:
//       "https://i5.walmartimages.com/seo/Walsunny-6-Piece-Patio-Dining-Set-with-Umbrella-Outdoor-Garden-Set-with-4-Folding-Chairs-and-Tempered-Glass-Top-Dining-Table-Black_deeb9393-ffe1-455f-b7d4-a367c5f75c67.1b1455521731332c70bb5dd5b5125b21.jpeg",
//     title: "Outdoor patio set with umbrella",
//     description:
//       "Wicker furniture, cushions included, perfect for small balconies.",
//     location: "Bohol",
//   },
// ];

interface test {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  images: string;
  barangay: string;
  created_at: Date;
  city: string;
  status: "available" | "reserved" | "claimed";
}

export default async function Items() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("items")
    .select("id, title,description,images,status,city");
  console.log(items, "items");
  if (error) return;

  return (
    <main>
      <Wrapper className="max-w-7xl">
        <h1 className="font-bold text-xl my-6">Todays pick</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id}>
              <Link
                href={`/items/${item.id}`}
                className="space-y-2 flex flex-col hover:underline hover:underline-offset-2 "
              >
                <div className="relative h-48 md:h-64 w-full">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    objectFit="cover"
                    className="rounded-md"
                  />
                  {/* <p className="absolute text-sm  bottom-0 left-0 pl-2 pb-2">
                  {item.status}
                </p> */}
                </div>
                <h2 className="font-bold text-xl">{item.title}</h2>
                <p className="text-sm text-shadow-muted-foreground font-medium ">
                  {item.description}
                </p>
                <footer className="text-sm text-muted-foreground mt-auto">
                  {item.city}
                </footer>
              </Link>
            </div>
          ))}
        </div>
      </Wrapper>
    </main>
  );
}
