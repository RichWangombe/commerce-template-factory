
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  images: string[];
  name?: string;
  productName?: string;
}

export const ProductImageCarousel = ({ 
  images, 
  name, 
  productName 
}: ProductImageCarouselProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const displayName = productName || name || "Product";

  // Make sure we always have at least one image
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="space-y-6">
      {/* Main Image Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="overflow-hidden rounded-xl bg-background">
                <AspectRatio ratio={1 / 1} className="bg-white">
                  <img
                    src={image}
                    alt={`${displayName} image ${index + 1}`}
                    className="object-contain w-full h-full transition-all duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center mt-4">
          <CarouselPrevious className="relative mr-2" />
          <CarouselNext className="relative ml-2" />
        </div>
      </Carousel>

      {/* Thumbnail Navigation */}
      <div className="hidden sm:flex gap-3 overflow-auto pb-2">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 ${
              selectedImage === index 
                ? 'ring-2 ring-offset-2 ring-black' 
                : 'border border-neutral-200'
            }`}
          >
            <img 
              src={image} 
              alt={`${displayName} thumbnail ${index + 1}`}
              className="object-cover w-full h-full" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};
