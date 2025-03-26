
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious
} from "@/components/ui/carousel";
import { useCarouselState } from "./useCarouselState";
import { ImageThumbnails } from "./ImageThumbnails";
import { CarouselImage } from "./CarouselImage";
import { LightboxImage } from "./LightboxImage";

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
  const {
    selectedImage,
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
  } = useCarouselState({ images, name, productName });

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
                <CarouselImage 
                  image={image}
                  index={index}
                  displayName={displayName}
                  openLightbox={openLightbox}
                />
                <DialogContent className="max-w-4xl w-full bg-black/90 border-none p-0 sm:p-1">
                  <LightboxImage 
                    images={displayImages}
                    lightboxIndex={lightboxIndex}
                    setLightboxIndex={setLightboxIndex}
                    setLightboxOpen={setLightboxOpen}
                    displayName={displayName}
                  />
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
      <ImageThumbnails 
        images={displayImages}
        selectedImage={selectedImage}
        handleThumbnailClick={handleThumbnailClick}
        displayName={displayName}
      />
    </div>
  );
};
