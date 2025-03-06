
import { useState } from "react";

interface ProductImagesProps {
  images: string[];
  name?: string;
  productName?: string;
}

export const ProductImages = ({ images, name, productName }: ProductImagesProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const displayName = productName || name || "Product";

  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 relative">
        <img
          src={images[selectedImage]}
          alt={displayName}
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
              alt={`${displayName} view ${index + 1}`}
              className="object-cover w-full h-full" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};
