export function getPathFromPublicUrl(url: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    throw new Error("Invalid Supabase public URL");
  }

  return url.slice(index + marker.length);
}
