import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface Order {
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

export const Orders: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem(`orders_${user?.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const demoOrders: Order[] = [
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
              image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
            },
            {
              id: 2,
              title: 'Mens Casual Premium Slim Fit T-Shirts',
              price: 22.3,
              quantity: 2,
              image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
            }
          ],
          shippingAddress: {
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
              id: 3,
              title: 'Mens Cotton Jacket',
              price: 55.99,
              quantity: 1,
              image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
            }
          ],
          shippingAddress: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        }
      ];
      setOrders(demoOrders);
      localStorage.setItem(`orders_${user?.id}`, JSON.stringify(demoOrders));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return '#4caf50';
      case 'shipped': return '#2196f3';
      case 'processing': return '#ff9800';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h1 className="text-[28px] text-gray-800 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center p-15 bg-gray-50 rounded-lg">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="inline-block mt-5 bg-blue-400 text-white no-underline px-5 py-2.5 rounded-md">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                <div>
                  <span className="font-bold text-base mr-4">Order #{order.id}</span>
                  <span className="text-gray-500 text-sm">Placed on {new Date(order.date).toLocaleDateString()}</span>
                </div>
                <span className="px-3 py-1 rounded text-white text-xs font-bold" style={{ backgroundColor: getStatusColor(order.status) }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              
              <div className="p-5">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-5 py-4 border-b border-gray-100 last:border-b-0">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-contain" />
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{item.title}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="font-bold text-base text-blue-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between p-5 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  <strong>Shipping Address:</strong>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                </div>
                <div className="text-right">
                  <strong>Total Amount:</strong>
                  <span className="text-xl font-bold text-blue-400 ml-2">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;