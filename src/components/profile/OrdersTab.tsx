
import React from 'react';
import { OrdersList } from '@/components/order/OrdersList';

export interface OrdersTabProps {
  orders?: any[]; // Replacing with proper type later
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders = [] }) => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Your Orders</h2>
        <OrdersList orders={orders} />
      </div>
    </div>
  );
};
