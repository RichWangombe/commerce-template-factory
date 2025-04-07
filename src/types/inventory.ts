
export interface SizeGuide {
  category: string;
  measurements: {
    size: string;
    dimensions: Record<string, string>;
  }[];
  measurementInstructions?: string;
}

export interface InventoryItem {
  productId: number;
  size?: string;
  color?: string;
  quantity: number;
  lowStockThreshold: number;
  sku: string;
}

export interface StockNotification {
  id: string;
  productId: number;
  userId: string;
  email: string;
  createdAt: string;
  size?: string;
  color?: string;
  notified: boolean;
}
