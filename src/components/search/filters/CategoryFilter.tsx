
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFilterProps {
  category: string;
  categories: string[];
  onChange: (value: string) => void;
}

export const CategoryFilter = ({ category, categories, onChange }: CategoryFilterProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Category</h3>
      <Select value={category} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
