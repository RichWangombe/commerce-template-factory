
import React from 'react';
import { SearchInput } from './SearchInput';

interface NavbarSearchProps {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavbarSearch = ({ isOpen, setIsOpen }: NavbarSearchProps) => {
  return (
    <div className="hidden md:block flex-1 max-w-md">
      <SearchInput minimal />
    </div>
  );
};
