
import { useState, useRef } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ZoomIn } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

interface CarouselImageProps {
  image: string;
  index: number;
  displayName: string;
  openLightbox: (index: number) => void;
}

export const CarouselImage = ({
  image,
  index,
  displayName,
  openLightbox
}: CarouselImageProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
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
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
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
  );
};
