
import { SearchInput } from './SearchInput';

export const NavbarSearch = () => {
  return (
    <div className="hidden md:block flex-1 max-w-md">
      <SearchInput minimal />
    </div>
  );
};
