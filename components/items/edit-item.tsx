"use client";
import Wrapper from "@/components/layout/Wrapper";
import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Item } from "../types/item";
import { useRouter } from "next/navigation";

const VALIDATION = {
  title: { min: 3, max: 100 },
  description: { min: 10, max: 1000 },
  category: { min: 2, max: 50 },
  city: { min: 2, max: 50 },
  barangay: { min: 2, max: 50 },
};

const IMAGE_VALIDATION = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
};

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

    // Validate each file
    for (const file of selectedFiles) {
      // Check file type
      if (!IMAGE_VALIDATION.allowedTypes.includes(file.type)) {
        toast.error(
          `Invalid file type: ${file.name}. Use JPG, PNG, GIF, or WebP`,
        );
        e.target.value = ""; // Reset input
        return;
      }
      // Check file size
      if (file.size > IMAGE_VALIDATION.maxSize) {
        toast.error(`File too large: ${file.name}. Max size is 5MB`);
        e.target.value = ""; // Reset input
        return;
      }
    }

    // Check total file count
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > IMAGE_VALIDATION.maxFiles) {
      toast.error(`Maximum ${IMAGE_VALIDATION.maxFiles} images allowed`);
      e.target.value = "";
      return;
    }

    // Add to existing files (instead of replacing)
    setFiles((prev) => [...prev, ...selectedFiles]);

    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file),
    );
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    e.target.value = ""; // Reset input for re-selection
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

    // Field length validation
    if (
      form.title.length < VALIDATION.title.min ||
      form.title.length > VALIDATION.title.max
    ) {
      toast.warning(
        `Title must be ${VALIDATION.title.min}-${VALIDATION.title.max} characters`,
      );
      setLoading(false);
      return;
    }

    if (
      form.description.length < VALIDATION.description.min ||
      form.description.length > VALIDATION.description.max
    ) {
      toast.warning(
        `Description must be ${VALIDATION.description.min}-${VALIDATION.description.max} characters`,
      );
      setLoading(false);
      return;
    }

    if (
      form.category.length < VALIDATION.category.min ||
      form.category.length > VALIDATION.category.max
    ) {
      toast.warning(
        `Category must be ${VALIDATION.category.min}-${VALIDATION.category.max} characters`,
      );
      setLoading(false);
      return;
    }

    if (
      form.city.length < VALIDATION.city.min ||
      form.city.length > VALIDATION.city.max
    ) {
      toast.warning(
        `City must be ${VALIDATION.city.min}-${VALIDATION.city.max} characters`,
      );
      setLoading(false);
      return;
    }

    if (
      form.barangay.length < VALIDATION.barangay.min ||
      form.barangay.length > VALIDATION.barangay.max
    ) {
      toast.warning(
        `Barangay must be ${VALIDATION.barangay.min}-${VALIDATION.barangay.max} characters`,
      );
      setLoading(false);
      return;
    }

    if (!files.length && existingImages.length === 0) {
      toast.warning("At least one image is required");
      setLoading(false);
      return;
    }

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
      setLoading(false);
      return;
    }
  }

  return (
    <main>
      <Wrapper className="max-w-3xl py-8 md:py-12">
        <BackButton />
        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          <header className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Revisions
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              Edit item
            </h1>
          </header>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Title
              </Label>
              <Textarea
                id="title"
                className="resize-none h-12 bg-card"
                value={form.title}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                className="h-32 resize-none bg-card"
                value={form.description}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Category
                </Label>
                <Textarea
                  id="category"
                  className="h-12 resize-none bg-card"
                  value={form.category}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  City
                </Label>
                <Textarea
                  id="city"
                  className="h-12 resize-none bg-card"
                  value={form.city}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barangay" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Barangay
                </Label>
                <Textarea
                  id="barangay"
                  className="h-12 resize-none bg-card"
                  value={form.barangay}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Photos
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {existingImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted ring-1 ring-border/40"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 33vw, 20vw"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(img)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-destructive text-destructive-foreground shadow-sm z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previewUrls.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted ring-1 ring-border/40"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 33vw, 20vw"
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-destructive text-destructive-foreground shadow-sm z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previewUrls.length < 10 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center transition-colors gap-1">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Add photo
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
          </div>

          <Button
            type="submit"
            disabled={loading || !hasChanges}
            size="lg"
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" /> Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </Wrapper>
    </main>
  );
}
