"use client";
import Wrapper from "@/components/layout/Wrapper";
import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Item } from "../types/item";
import { useRouter } from "next/navigation";

export default function EditItemForm({ item }: { item: Item }) {
  const router = useRouter();
  const [original] = useState(() => ({
    title: item.title,
    description: item.description,
    category: item.category,
    city: item.city,
    barangay: item.barangay,
    images: item.images,
  }));

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: item.title,
    description: item.description,
    category: item.category,
    city: item.city,
    barangay: item.barangay,
  });

  const [existingImages, setExistingImages] = useState<string[]>(
    item.images, // array of URLs
  );
  const [files, setFiles] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  function arraysEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  const hasChanges =
    form.title !== original.title ||
    form.description !== original.description ||
    form.category !== original.category ||
    form.city !== original.city ||
    form.barangay !== original.barangay ||
    !arraysEqual(existingImages, original.images) ||
    files.length > 0;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles: File[] = Array.from(e.currentTarget.files ?? []);
    setFiles(selectedFiles);

    // Generate image preview URLs for selected files
    const newPreviewUrls: string[] = selectedFiles.map(
      (file) => URL.createObjectURL(file), // Create object URL for the file
    );
    setPreviewUrls(newPreviewUrls); // Update the state with the new preview URLs
  };

  const handleRemoveExisting = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setRemovedImages((prev) => [...prev, url]);
  };
  const handleRemoveFile = (index: number) => {
    // Remove file and its preview URL
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const requiredFields = [
      "title",
      "description",
      "category",
      "city",
      "barangay",
    ] as const;

    for (const field of requiredFields) {
      if (!form[field]?.toString().trim()) {
        toast.warning(
          `${field[0]?.toUpperCase() + field.slice(1)} is required`,
        );
        setLoading(false);
        return;
      }
    }

    if (!files.length && existingImages.length === 0) {
      toast.warning("At least one image is required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    // formData.append("id", item.id);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("city", form.city);
    formData.append("barangay", form.barangay);
    files.forEach((file) => {
      formData.append("images", file);
    });
    existingImages.forEach((existingFile) => {
      formData.append("existingImages", existingFile);
    });
    if (removedImages.length > 0) {
      removedImages.forEach((url) => {
        formData.append("removedImages", url);
      });
    }

    const res = await fetch(`/api/edit-item/${item.id}`, {
      method: "PATCH",
      body: formData,
    });
    if (res.ok) {
      toast.success("Item edited successfully");
      setLoading(false);
      router.push(`/items/${item.id}`);
    } else {
      const result = await res.json();
      console.error(result.error);
      toast.error(result.error, {
        duration: 5000,
      });
    }

    setLoading(false);
  }

  return (
    <main>
      <Wrapper className="max-w-xl lg:max-w-7xl grid lg:grid-cols-2 gap-x-6 mt-5 md:mt-20">
        <form onSubmit={handleSubmit}>
          <BackButton />
          <div className="space-y-4">
            <h1 className="font-bold text-2xl">Edit item</h1>
            <Label htmlFor="title">Title</Label>
            <Textarea
              id="title"
              className="resize-none h-12"
              value={form.title}
              onChange={handleFormChange}
              required
            />
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="h-32 resize-none"
              value={form.description}
              onChange={handleFormChange}
              required
            />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <Label htmlFor="category">Category</Label>
                <Textarea
                  id="category"
                  className="h-12 resize-none "
                  value={form.category}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="city">City</Label>
                <Textarea
                  id="city"
                  className="h-12 resize-none "
                  value={form.city}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="barangay">Barangay</Label>
                <Textarea
                  id="barangay"
                  className="h-12 resize-none"
                  value={form.barangay}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-base font-medium mb-3 block">Photos</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {existingImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(img)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previewUrls.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previewUrls.length < 10 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center transition-colors">
                    <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Add Photo
                    </span>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <Button type="submit" disabled={loading || !hasChanges}>
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" /> Uploading...
                </>
              ) : (
                "Confirm Edit"
              )}
            </Button>
          </div>
        </form>
      </Wrapper>
    </main>
  );
}
