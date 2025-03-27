
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden"
      onClick={onClick}
    >
      <Search className="h-5 w-5" />
      <span className="sr-only">Search</span>
    </Button>
  );
};
