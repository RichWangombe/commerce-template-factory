
import React, { useState } from 'react';
import { SearchInput } from './SearchInput';

interface NavbarSearchProps {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavbarSearch = ({ isOpen, setIsOpen }: NavbarSearchProps) => {
  return (
    <div className="w-full max-w-md">
      <SearchInput minimal />
    </div>
  );
};
