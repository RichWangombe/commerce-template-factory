
import { useState } from "react";

interface ProductImagesProps {
  images: string[];
  name: string;
}

export const ProductImages = ({ images, name }: ProductImagesProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 relative">
        <img
          src={images[selectedImage]}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="flex gap-3 overflow-auto pb-2">
        {images.map((image, index) => (
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
              alt={`${name} view ${index + 1}`}
              className="object-cover w-full h-full" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};
