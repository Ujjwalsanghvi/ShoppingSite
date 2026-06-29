import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  loadOrders, 
  loadWalletData,
  selectProfileLoading,
  selectOrders
} from '../../store/slices/profileSlice';
import { OrderBarChart } from '../../components/Charts/OrderBarChart';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { OrderStatusPieChart } from '../../components/Charts/OrderStatusPieChart';
import { SpendingBarChart } from '../../components/Charts/SpendingBarChart';

export const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectProfileLoading);
  const orders = useAppSelector(selectOrders);

  useEffect(() => {
    dispatch(loadOrders());
    dispatch(loadWalletData());
  }, [dispatch]);

  if (loading) {
  return <LoadingSpinner size="large" message="Loading analytics..." />;
}

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-100 p-5 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl md:text-[28px] text-gray-800 mb-8">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered Orders</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <OrderBarChart />
          <OrderStatusPieChart />
        </div>
        
        <div>
          <SpendingBarChart />
        </div>
      </div>
    </div>
  );
};