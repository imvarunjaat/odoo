"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Upload } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ProfileSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const updateProfile = useMutation(api.auth.updateProfile);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, we'll save the base64 image data
      // TODO: In production, upload to Convex file storage, Cloudinary, or AWS S3
      if (selectedImage) {
        await updateProfile({
          userId: user._id,
          image: selectedImage,
        });
      }
      
      router.push("/home");
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/home");
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a profile picture to personalize your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedImage || user.image} alt={user.name} />
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Profile Picture
            </Button>
          </div>

          {/* User Info Display */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={user.name}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="w-full"
              disabled={isLoading}
            >
              Skip for now
            </Button>
          </div>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          You can always update your profile picture later in settings
        </p>
      </div>
    </div>
  );
}