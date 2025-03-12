
import { Link } from "react-router-dom";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  maxItems?: number;
}

export const Breadcrumbs = ({ 
  items, 
  className,
  maxItems = 3 
}: BreadcrumbsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const isLongPath = items.length > maxItems;
  
  // Show first, last, and one in the middle for long paths on mobile
  const visibleItems = isLongPath 
    ? [...items.slice(0, 1), ...items.slice(-1)] 
    : items;
  
  // Items to show in dropdown when path is long
  const hiddenItems = isLongPath 
    ? items.slice(1, -1) 
    : [];

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground overflow-hidden",
        className
      )}
    >
      <ol className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
        <li className="flex-shrink-0">
          <Link
            to="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {/* Always visible items */}
        {visibleItems.map((item, index) => (
          <li key={`visible-${index}`} className="flex items-center flex-shrink-0">
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            {item.href ? (
              <Link
                to={item.href}
                className="ml-1 hover:text-foreground transition-colors line-clamp-1"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 font-medium text-foreground line-clamp-1">
                {item.label}
              </span>
            )}
          </li>
        ))}
        
        {/* Dropdown for hidden items */}
        {isLongPath && hiddenItems.length > 0 && (
          <li className="flex items-center flex-shrink-0">
            <ChevronRight className="h-4 w-4" />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center h-6 w-6 hover:bg-accent hover:text-accent-foreground rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More breadcrumbs</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {hiddenItems.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    {item.href ? (
                      <Link to={item.href}>{item.label}</Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ol>
    </nav>
  );
};
