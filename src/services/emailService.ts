
import { Order } from "@/types/checkout";

const EMAIL_TEMPLATES = {
  orderConfirmation: (order: Order) => ({
    subject: `Order Confirmed - #${order.id}`,
    body: `Thank you for your order! We'll notify you when it ships.`
  }),
  orderShipped: (order: Order) => ({
    subject: `Order Shipped - #${order.id}`,
    body: `Your order is on its way! Track it here: ${order.trackingNumber}`
  }),
  orderDelivered: (order: Order) => ({
    subject: `Order Delivered - #${order.id}`,
    body: `Your order has been delivered! Thank you for shopping with us.`
  }),
  backInStock: (productName: string) => ({
    subject: `${productName} is back in stock!`,
    body: `The item you wanted is now available. Shop now before it's gone!`
  })
};

export const emailService = {
  async sendOrderStatusEmail(order: Order, status: Order['status']) {
    // Implementation needed: Integrate with your email service provider
    const template = EMAIL_TEMPLATES[status];
    if (!template) return;
    
    const email = template(order);
    console.log(`Sending email: ${email.subject}`);
    // Send email implementation
  },

  async sendBackInStockNotification(notification: StockNotification, productName: string) {
    const template = EMAIL_TEMPLATES.backInStock(productName);
    console.log(`Sending back in stock notification for ${productName}`);
    // Send email implementation
  }
};
