
interface ImageThumbnailsProps {
  images: string[];
  selectedImage: number;
  handleThumbnailClick: (index: number) => void;
  displayName: string;
}

export const ImageThumbnails = ({
  images,
  selectedImage,
  handleThumbnailClick,
  displayName
}: ImageThumbnailsProps) => {
  return (
    <div className="hidden sm:flex gap-3 overflow-auto pb-2 scrollbar-hide">
      {images.map((image, index) => (
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
  );
};
