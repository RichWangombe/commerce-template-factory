
import { useState, useRef, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoveLeft, MoveRight, ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const imageRef = useRef<HTMLDivElement>(null);
  const displayName = productName || name || "Product";

  // Make sure we always have at least one image
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];
  
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
  
  // Handle mouse position for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };
  
  // Open lightbox with specific image
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  
  // Navigate through lightbox images
  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setLightboxIndex((prev) => (prev + 1) % displayImages.length);
    } else {
      setLightboxIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Image Carousel */}
      <Carousel 
        className="w-full" 
        opts={{ 
          loop: true,
          skipSnaps: true
        }}
        setApi={setCarouselApi}
      >
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index} className="cursor-pointer">
              <Dialog open={lightboxOpen && lightboxIndex === index} onOpenChange={setLightboxOpen}>
                <DialogTrigger asChild>
                  <div 
                    className="overflow-hidden rounded-xl bg-background relative group"
                    onClick={() => openLightbox(index)}
                  >
                    <AspectRatio ratio={1 / 1} className="bg-white">
                      <div
                        ref={imageRef}
                        className={`relative w-full h-full transition-all duration-300 ${
                          isZoomed ? 'scale-150' : 'hover:scale-105'
                        }`}
                        onClick={() => setIsZoomed(!isZoomed)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setIsZoomed(false)}
                      >
                        <img
                          src={image}
                          alt={`${displayName} image ${index + 1}`}
                          className="object-contain w-full h-full"
                          loading="lazy"
                        />
                      </div>
                    </AspectRatio>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="icon" className="rounded-full shadow-md">
                        <ZoomIn className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full bg-black/90 border-none p-0 sm:p-1">
                  <div className="relative w-full flex flex-col items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 z-50 text-white rounded-full bg-black/50 hover:bg-black/70"
                      onClick={() => setLightboxOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    
                    <div className="w-full h-full flex justify-center items-center py-8">
                      <img
                        src={displayImages[lightboxIndex]}
                        alt={`${displayName} full view ${lightboxIndex + 1}`}
                        className="max-h-[80vh] object-contain"
                      />
                    </div>
                    
                    <div className="flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white bg-black/50 hover:bg-black/70 rounded-full"
                        onClick={() => navigateLightbox('prev')}
                      >
                        <MoveLeft className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white bg-black/50 hover:bg-black/70 rounded-full"
                        onClick={() => navigateLightbox('next')}
                      >
                        <MoveRight className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {displayImages.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {displayImages.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full ${
                              idx === lightboxIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                            onClick={() => setLightboxIndex(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center mt-4">
          <CarouselPrevious className="relative mr-2" />
          <CarouselNext className="relative ml-2" />
        </div>
      </Carousel>

      {/* Thumbnail Navigation */}
      <div className="hidden sm:flex gap-3 overflow-auto pb-2 scrollbar-hide">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`relative rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 hover:opacity-100 transition-all ${
              selectedImage === index 
                ? 'ring-2 ring-offset-2 ring-black opacity-100' 
                : 'border border-neutral-200 opacity-70'
            }`}
          >
            <img 
              src={image} 
              alt={`${displayName} thumbnail ${index + 1}`}
              className="object-cover w-full h-full" 
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
