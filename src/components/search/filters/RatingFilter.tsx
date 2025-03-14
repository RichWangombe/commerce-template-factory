
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';

interface RatingFilterProps {
  rating: number;
  onChange: (value: number) => void;
}

export const RatingFilter = ({ rating, onChange }: RatingFilterProps) => {
  const handleRatingChange = (value: string) => {
    onChange(parseInt(value));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Minimum Rating</h3>
      <Select value={rating.toString()} onValueChange={handleRatingChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select minimum rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Any Rating</SelectItem>
          <SelectItem value="1">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="ml-1">& up</span>
            </div>
          </SelectItem>
          <SelectItem value="2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="ml-1">& up</span>
            </div>
          </SelectItem>
          <SelectItem value="3">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="ml-1">& up</span>
            </div>
          </SelectItem>
          <SelectItem value="4">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="ml-1">& up</span>
            </div>
          </SelectItem>
          <SelectItem value="5">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="ml-1">Only</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
