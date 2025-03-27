
import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "./NavLink";

interface NavLinksProps {
  onClick?: () => void;
}

export const NavLinks = ({ onClick }: NavLinksProps) => {
  const location = useLocation();
  
  return (
    <>
      <NavLink to="/categories" onClick={onClick} currentPath={location.pathname}>
        Categories
      </NavLink>
      <NavLink to="/new-arrivals" onClick={onClick} currentPath={location.pathname}>
        New Arrivals
      </NavLink>
      <NavLink to="/products" onClick={onClick} currentPath={location.pathname}>
        All Products
      </NavLink>
    </>
  );
};
