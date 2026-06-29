import { Order } from "../types/Order";

export const demoOrders: Order[] = [ // Changed ImpOrder[] to Order[]
        {
          id: 'ORD-001',
          date: '2024-05-10',
          total: 299.97,
          status: 'delivered',
          items: [
            {
              id: 1,
              title: 'Fjallraven - Foldsack No. 1 Backpack',
              price: 109.95,
              quantity: 1,
              image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
            },
          ],
          shippingAddress: { // Add shippingAddress property to match Order interface
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        },
        {
          id: 'ORD-002',
          date: '2024-05-05',
          total: 89.99,
          status: 'shipped',
          items: [
            {
              id: 2,
              title: 'Mens Casual Premium Slim Fit T-Shirts',
              price: 22.3,
              quantity: 2,
              image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
            },
          ],
          shippingAddress: { // Add shippingAddress property to match Order interface
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        },
      ];