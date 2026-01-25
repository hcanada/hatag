"use client";
import Wrapper from "@/components/layout/Wrapper";
import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, LoaderCircle, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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

export default function Upload() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    city: "",
    barangay: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  // test
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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

  //###################//###################//###################//###################

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

    if (!files.length) {
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
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("city", form.city);
    formData.append("barangay", form.barangay);
    files.forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch("/api/upload-item", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      setLoading(false);
      const result = await res.json();
      toast.error(result.error || "Something went wrong");
      return;
    }

    toast.success("Item uploaded successfully");
    setForm({
      title: "",
      description: "",
      category: "",
      city: "",
      barangay: "",
    });
    setFiles([]);
    setPreviewUrls([]);
    setLoading(false);
  }

  return (
    <main>
      <Wrapper className="max-w-xl lg:max-w-7xl grid lg:grid-cols-2 gap-x-6 mt-5 md:mt-20">
        <form onSubmit={handleSubmit}>
          <BackButton />
          <div className="space-y-4">
            <h1 className="font-bold text-2xl">Upload item</h1>
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
                {previewUrls.length < 5 && (
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
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" /> Uploading...
                </>
              ) : (
                "Upload Item"
              )}
            </Button>
          </div>
        </form>
      </Wrapper>
    </main>
  );
}
