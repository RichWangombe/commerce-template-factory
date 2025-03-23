
import React from 'react';
import { Sparkles } from 'lucide-react';

export const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="container mx-auto px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
            New Arrivals <Sparkles className="h-8 w-8" />
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Discover our latest products, hot off the shelves and ready to elevate your tech experience.
          </p>
        </div>
      </div>
    </div>
  );
};
