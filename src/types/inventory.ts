
export interface InventoryItem {
  id: number;
  productId: number;
  size: string;
  color: string;
  quantity: number;
  lowStockThreshold: number;
  lastRestocked: string;
  location?: string;
  sku?: string;
  status?: 'active' | 'discontinued' | 'out-of-stock';
}

export interface StockNotification {
  id: number;
  productId: number;
  userId: string;
  email: string;
  size?: string;
  color?: string;
  createdAt: string;
  status: 'pending' | 'sent' | 'cancelled';
  sentAt?: string;
}

export interface InventoryUpdate {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
  restockDate?: string;
}

export interface InventoryStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  topSellingItems: Array<{
    productId: number;
    name: string;
    salesCount: number;
  }>;
}
