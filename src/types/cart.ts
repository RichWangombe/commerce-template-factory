
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  variant?: string;
};

export type CartPreferences = {
  darkMode?: boolean;
  currency?: string;
  notificationEnabled?: boolean;
  language?: string;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
  userPreferences: CartPreferences;
};

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<CartPreferences> };
