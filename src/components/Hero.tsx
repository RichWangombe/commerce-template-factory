
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  const slides = [
    {
      title: "Discover cutting-edge tech",
      subtitle: "Products for your lifestyle",
      description: "Browse gadgets by category or deals available",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
      className: "bg-gradient-to-r from-slate-100 to-slate-200",
    },
    {
      title: "New Photography Gear",
      subtitle: "Capture Every Moment",
      description: "Professional cameras and accessories for enthusiasts",
      image: "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=800&auto=format&fit=crop",
      className: "bg-gradient-to-r from-amber-50 to-amber-100",
    },
    {
      title: "Smart Home Solutions",
      subtitle: "Transform Your Space",
      description: "Devices that make everyday life easier and more connected",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop",
      className: "bg-gradient-to-r from-emerald-50 to-teal-100",
    },
  ];

  useEffect(() => {
    // Preload all images
    slides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${slide.image}`);
        // Set a fallback image
        slides[index].image = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop";
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 flex items-center transition-opacity duration-1000",
              index === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none",
              slide.className
            )}
          >
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
              {/* Text Content */}
              <div className="w-full md:w-1/2 text-left space-y-6 z-10">
                <span className="inline-block text-sm px-3 py-1 rounded-full bg-black/5 backdrop-blur-sm">
                  {slide.subtitle}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg text-neutral-600 max-w-md">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="button-press rounded-full bg-black px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800">
                    Shop Now
                  </button>
                  <button className="button-press rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-neutral-50">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="w-full md:w-1/2 md:pl-12 mt-8 md:mt-0 flex justify-center">
                {imagesLoaded[index] || index !== activeSlide ? (
                  <img
                    src={slide.image}
                    alt={`${slide.title} hero product`}
                    className={cn(
                      "max-h-[300px] md:max-h-[400px] object-contain transition-all duration-700 transform rounded-lg shadow-md",
                      isAnimating && index === activeSlide ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    )}
                    onError={(e) => {
                      // Fallback for runtime errors
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop";
                      target.onerror = null; // Prevent infinite loops
                    }}
                  />
                ) : (
                  <div className="max-h-[300px] md:max-h-[400px] w-[300px] flex items-center justify-center bg-gray-200 rounded-lg animate-pulse">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveSlide(index);
            }}
            className={cn(
              "w-12 h-1.5 rounded-full transition-all duration-300",
              index === activeSlide 
                ? "bg-black w-12" 
                : "bg-black/20 w-6 hover:bg-black/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-transform hover:scale-105 z-10"
        aria-label="Previous slide"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 19l-7-7 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-transform hover:scale-105 z-10"
        aria-label="Next slide"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
};
