
import React from "react";
import { Sparkles } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <Sparkles className="h-7 w-7 text-primary" />
        {title}
      </h1>
      <p className="text-muted-foreground max-w-2xl">{description}</p>
    </div>
  );
};

export default PageHeader;
