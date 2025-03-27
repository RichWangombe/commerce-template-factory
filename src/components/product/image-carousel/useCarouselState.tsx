
import { useState, useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import { isValidImageUrl, getDefaultProductImage } from "@/utils/imageUtils";

export interface UseCarouselStateProps {
  images: string[];
  name?: string;
  productName?: string;
}

export const useCarouselState = ({ images, name, productName }: UseCarouselStateProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const displayName = productName || name || "Product";

  // Filter out any potentially problematic image URLs using our utility
  const validImages = images.filter(img => isValidImageUrl(img));
  
  // Make sure we always have at least one image
  const displayImages = validImages.length > 0 ? validImages : [getDefaultProductImage()];
  
  // Handle changes in carousel position
  useEffect(() => {
    if (!carouselApi) return;

    const onChange = () => {
      setSelectedImage(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onChange);
    // Initialize selected image
    onChange();

    return () => {
      carouselApi.off("select", onChange);
    };
  }, [carouselApi]);
  
  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
    carouselApi?.scrollTo(index);
  };
  
  // Open lightbox with specific image
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return {
    selectedImage,
    setSelectedImage,
    isZoomed,
    setIsZoomed,
    lightboxOpen,
    setLightboxOpen,
    lightboxIndex,
    setLightboxIndex,
    carouselApi,
    setCarouselApi,
    displayName,
    displayImages,
    handleThumbnailClick,
    openLightbox
  };
};
