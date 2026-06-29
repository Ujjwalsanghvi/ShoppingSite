export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// OrderCardProps interface
export interface OrderCardProps {
  order: Order;
  getStatusColor: (status: string) => string;
}

// For backward compatibility
export type ImpOrder = Order;