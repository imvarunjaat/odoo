"use client";

import { useState } from 'react';

export interface ImageUploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export function useImageUpload(options: ImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    maxSizeInMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  } = options;

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload an image file.');
      }

      // Validate file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        throw new Error(`File size must be less than ${maxSizeInMB}MB`);
      }

      // For now, we'll create a local URL for the image
      // TODO: Implement proper Convex file storage after fixing the 500 errors
      const imageUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
    clearError: () => setError(null)
  };
}