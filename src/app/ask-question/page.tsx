"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AskQuestionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const { uploadImage, isUploading } = useImageUpload();
  const createQuestion = useMutation(api.questions.createQuestion);

  // Character counters
  const titleMaxLength = 200;
  const maxTags = 5;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Apply character limits
    if (name === "title" && value.length > titleMaxLength) return;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      description: content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      setError("You must be logged in to ask a question");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication required. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse tags from comma-separated string
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
        .slice(0, maxTags); // Limit to max tags

      const result = await createQuestion({
        title: formData.title,
        description: formData.description,
        tags: tags,
        authorToken: token,
      });

      console.log("Question created successfully:", result);
      router.push("/home");
    } catch (error) {
      console.error("Error submitting question:", error);
      setError(error instanceof Error ? error.message : "Failed to submit question");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/home");
  };

  // Parse tags from comma-separated string
  const parsedTags = formData.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-4">You need to be logged in to ask a question.</p>
            <Button onClick={() => router.push("/auth")}>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex justify-center py-8 px-4">
        <div className="w-full max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Ask a Question</h1>
            <p className="text-muted-foreground">
              Get help from the community by asking a clear, detailed question
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Question Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What's your programming question? Be specific."
                className="h-12"
                required
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.title.length}/{titleMaxLength} characters
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description <span className="text-destructive">*</span>
              </Label>
              <RichTextEditor
                content={formData.description}
                onChange={handleDescriptionChange}
                placeholder="Provide detailed information about your question. Include what you've tried, expected results, and any error messages."
                onImageUpload={uploadImage}
                className="min-h-[200px]"
              />
              <div className="text-xs text-muted-foreground">
                Use the toolbar to format your text, add links, images, and more.
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="javascript, react, node.js (separate with commas)"
                className="h-12"
              />
              <div className="text-xs text-muted-foreground">
                Add up to {maxTags} tags to help others find your question
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="px-8 py-6 text-base font-medium"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? "Submitting..." : isUploading ? "Uploading..." : "Submit Question"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-8 py-6 text-base font-medium"
                onClick={handleCancel}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
