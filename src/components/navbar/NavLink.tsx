
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  currentPath?: string;
}

export const NavLink = ({ to, children, onClick, currentPath }: NavLinkProps) => {
  const location = useLocation();
  const isActive = (currentPath || location.pathname) === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "text-sm font-medium transition-colors relative group",
        isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
      )}
      onClick={onClick}
    >
      {children}
      {isActive && (
        <motion.span 
          className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
          layoutId="navbar-indicator"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
};
