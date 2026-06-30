import React, { useState, useEffect, useCallback } from 'react';
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

export const OrderManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    const savedOrders = localStorage.getItem(`orders_${user?.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const demoOrders: Order[] = [
        {
          id: 'ORD-001',
          date: '2024-05-10',
          total: 299.97,
          status: 'pending',
          items: [
            {
              id: 1,
              title: 'Fjallraven - Foldsack No. 1 Backpack',
              price: 109.95,
              quantity: 1,
              image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
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
          status: 'processing',
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
  }, [user?.id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${user?.id}`, JSON.stringify(updatedOrders));
    setSelectedOrder(null);
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

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 p-5 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-[28px] text-gray-800">Order Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Total Orders: {orders.length}</span>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              All ({orders.length})
            </button>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === status 
                    ? 'text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                style={filter === status ? { backgroundColor: getStatusColor(status) } : {}}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({getStatusCount(status)})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center">
            <p className="text-gray-500">No orders found with this status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm">Order #{order.id}</span>
                    <span className="text-gray-500 text-xs ml-3">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded text-white text-xs font-bold" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-blue-400 hover:text-blue-500 text-xs font-medium"
                    >
                      {selectedOrder === order.id ? '✕ Close' : '✏️ Update'}
                    </button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className="flex gap-4 items-center">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img key={idx} src={item.image} alt={item.title} className="w-12 h-12 object-contain border-2 border-white rounded-lg" />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600 border-2 border-white">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">Total: ${order.total.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 ml-2">{order.items.length} items</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </div>
                </div>

                {/* Status Update Dropdown */}
                {selectedOrder === order.id && (
                  <div className="p-4 bg-blue-50 border-t border-blue-100">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">Change Status:</span>
                      <div className="flex gap-2 flex-wrap">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status as Order['status'])}
                            disabled={status === order.status}
                            className={`px-3 py-1 rounded text-xs font-medium transition-all duration-300 ${
                              status === order.status
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'text-white hover:scale-105'
                            }`}
                            style={{ 
                              backgroundColor: status === order.status ? '#ccc' : getStatusColor(status)
                            }}
                          >
                            {status.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Current Status: <span className="font-medium">{order.status.toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};