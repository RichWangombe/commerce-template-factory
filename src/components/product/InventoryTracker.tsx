
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryItem, StockNotification } from "@/types/inventory";
import { toast } from "sonner";

interface InventoryTrackerProps {
  productId: number;
  inventory: InventoryItem;
}

export const InventoryTracker: React.FC<InventoryTrackerProps> = ({ productId, inventory }) => {
  const { user } = useAuth();
  const [isNotifying, setIsNotifying] = React.useState(false);

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity <= 0) return 'out-of-stock';
    if (quantity <= threshold) return 'low-stock';
    return 'in-stock';
  };

  const handleNotifyMe = async () => {
    if (!user) {
      toast.error("Please sign in to get notifications");
      return;
    }

    try {
      setIsNotifying(true);
      // Create notification request
      const notification: Partial<StockNotification> = {
        productId,
        userId: user.id,
        email: user.email,
        size: inventory.size,
        color: inventory.color,
      };

      // Save to database (implementation needed)
      toast.success("We'll notify you when this item is back in stock!");
    } catch (error) {
      toast.error("Failed to set notification");
    } finally {
      setIsNotifying(false);
    }
  };

  const status = getStockStatus(inventory.quantity, inventory.lowStockThreshold);

  return (
    <div className="flex items-center gap-2">
      {status === 'out-of-stock' ? (
        <div className="space-y-2">
          <Badge variant="destructive">Out of Stock</Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNotifyMe}
            disabled={isNotifying}
          >
            Notify When Available
          </Button>
        </div>
      ) : status === 'low-stock' ? (
        <Badge variant="warning">Low Stock - Only {inventory.quantity} left</Badge>
      ) : (
        <Badge variant="success">In Stock</Badge>
      )}
    </div>
  );
};
