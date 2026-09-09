//hooks/useImageFallback.ts
//a reusable hook to handle image loading errors and provide a fallback mechanism for images in the application.

import { useState } from 'react';

export const useImageFallback = () => {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (id: number) => {
    setFailedImages((prev) => new Set(prev).add(id));
  };

  const hasFailed = (id: number) => failedImages.has(id);

  return { handleImageError, hasFailed };
};
