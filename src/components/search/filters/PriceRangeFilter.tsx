
import { Dispatch, SetStateAction } from 'react';
import { Slider } from '@/components/ui/slider';

interface PriceRangeFilterProps {
  priceRange: [number, number];
  onChange: (value: [number, number]) => void;
}

export const PriceRangeFilter = ({ priceRange, onChange }: PriceRangeFilterProps) => {
  const handlePriceChange = (value: number[]) => {
    onChange([value[0], value[1]]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Price Range</h3>
        <span className="text-xs text-gray-500">
          ${priceRange[0]} - ${priceRange[1]}
        </span>
      </div>
      <Slider
        defaultValue={[0, 1000]}
        min={0}
        max={1000}
        step={10}
        value={[priceRange[0], priceRange[1]]}
        onValueChange={handlePriceChange}
        className="mt-2"
      />
    </div>
  );
};
