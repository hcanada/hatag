import { getPathFromPublicUrl } from "@/lib/supabase/image-path";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ item_id: string }> },
) {
  // Handle PATCH request

  const { item_id } = await params;

  const itemId = parseInt(item_id);
  if (isNaN(itemId) || itemId <= 0) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

  const formData = await req.formData();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: item, error: fetchError } = await supabase
    .from("items")
    .select("user_id")
    .eq("id", itemId)
    .single();

  if (fetchError || !item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (item.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const city = formData.get("city") as string;
  const barangay = formData.get("barangay") as string;
  const files = formData.getAll("images") as File[];
  const existingImages = formData.getAll("existingImages") as string[];
  const removedImages = formData.getAll("removedImages") as string[];
  const imagePaths: string[] = [];
  for (const file of files) {
    const path = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage.from("items").upload(path, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = await supabase.storage.from("items").getPublicUrl(path);
    imagePaths.push(data.publicUrl);
  }

  let finalImages: string[] = [];

  if (existingImages.length > 0) {
    finalImages = [...existingImages, ...imagePaths];
  } else {
    finalImages = [...imagePaths];
  }

  const { error } = await supabase
    .from("items")
    .update({
      user_id: user.id,
      title,
      description,
      category,
      city,
      barangay,
      images: finalImages,
      updated_at: new Date(),
    })
    .eq("id", itemId);

  if (error) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (removedImages.length > 0) {
    const paths = removedImages.map((url) =>
      getPathFromPublicUrl(url, "items"),
    );

    await supabase.storage.from("items").remove(paths);
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
