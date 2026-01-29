import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

// Handle POST request

export async function POST(req: Request) {
  const formData = await req.formData();
  const supabase = await createClient();

  //
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const city = formData.get("city") as string;
  const barangay = formData.get("barangay") as string;
  const files = formData.getAll("images") as File[];

  const storagePaths: string[] = []; // For cleanup
  const publicUrls: string[] = []; // For DB

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILES = 5;

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_FILES} files allowed` },
      { status: 400 },
    );
  }

  for (const file of files) {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}` },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${file.size} bytes` },
        { status: 400 },
      );
    }
    const ext = file.name.split(".").pop();
    const path = `${randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("items").upload(path, file);

    if (error) {
      if (storagePaths.length > 0) {
        await supabase.storage.from("items").remove(storagePaths);
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    storagePaths.push(path);
    const { data } = await supabase.storage.from("items").getPublicUrl(path);
    publicUrls.push(data.publicUrl);
  }

  const { error } = await supabase.from("items").insert({
    user_id: user.id,
    title,
    description,
    category,
    city,
    barangay,
    images: publicUrls,
  });

  if (error) {
    await supabase.storage.from("items").remove(storagePaths);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
