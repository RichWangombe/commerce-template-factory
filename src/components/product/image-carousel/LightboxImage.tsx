
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight, X } from "lucide-react";

interface LightboxImageProps {
  images: string[];
  lightboxIndex: number;
  setLightboxIndex: (index: number) => void;
  setLightboxOpen: (open: boolean) => void;
  displayName: string;
}

export const LightboxImage = ({
  images,
  lightboxIndex,
  setLightboxIndex,
  setLightboxOpen,
  displayName
}: LightboxImageProps) => {
  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    } else {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
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
          src={images[lightboxIndex]}
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
      
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, idx) => (
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
  );
};
