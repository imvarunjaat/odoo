"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AskQuestionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });

  // Character counters
  const titleMaxLength = 200;
  const descriptionMaxLength = 500;
  const maxTags = 5;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Apply character limits
    if (name === "title" && value.length > titleMaxLength) return;
    if (name === "description" && value.length > descriptionMaxLength) return;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This would be replaced with actual question submission logic
      // For now, we'll simulate a successful submission
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error submitting question:", error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  // Parse tags from comma-separated string
  const parsedTags = formData.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

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
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed information about your question. Include what you've tried, expected results, and any error messages."
                className="min-h-[200px] resize-y"
                required
              />
              <div className="text-xs text-muted-foreground text-right">
                {descriptionMaxLength - formData.description.length} characters remaining
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-8 py-6 text-base font-medium"
                onClick={handleCancel}
                disabled={isSubmitting}
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
