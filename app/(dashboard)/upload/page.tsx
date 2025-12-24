"use client";
import Wrapper from "@/components/layout/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip } from "lucide-react";
import React, { useState } from "react";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  // test
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles: File[] = Array.from(e.currentTarget.files ?? []);
    setFiles(selectedFiles);

    // Generate image preview URLs for selected files
    const newPreviewUrls: string[] = selectedFiles.map(
      (file) => URL.createObjectURL(file) // Create object URL for the file
    );
    console.log(newPreviewUrls);
    setPreviewUrls(newPreviewUrls); // Update the state with the new preview URLs
  };

  const handleRemoveFile = (index: number) => {
    // Remove file and its preview URL
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviewUrls);
  };

  //###################//###################//###################//###################

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch("/api/items", {
      method: "POST",
      body: formData,
    });
    console.log(res);
    if (!res.ok) return;
    setTitle("");
    setDescription("");
    setFiles([]);
    console.log(files);
  }

  return (
    <main>
      <Wrapper className="max-w-7xl grid md:grid-cols-2 gap-x-6 mt-5 md:mt-20">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h1 className="font-bold text-2xl">Upload item</h1>
            <Label htmlFor="title">Title</Label>
            <Textarea
              id="title"
              className="resize-none h-12"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              className="h-32 resize-none"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              required
            />

            <Input
              id="file"
              type="file"
              multiple
              required
              accept="image/*"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file"
              className="hover:cursor-pointer flex gap-x-4 w-fit border p-2 rounded-md"
            >
              Upload Image
              <Paperclip />
            </label>
            <div className="mt-4 flex gap-x-4">
              {previewUrls.length > 0 &&
                previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    {/* Image preview */}
                    <img
                      src={url}
                      alt={`file preview ${index}`}
                      className="w-20 h-20 object-cover"
                    />

                    {/* Close button */}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-0 right-0 bg-red-500 p-1 rounded-full hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
            <Button type="submit">Upload Item</Button>
          </div>
        </form>
      </Wrapper>
    </main>
  );
}
