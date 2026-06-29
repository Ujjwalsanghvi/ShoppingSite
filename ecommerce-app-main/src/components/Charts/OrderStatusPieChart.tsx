import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useAppSelector } from '../../store/hooks';
import { selectOrders } from '../../store/slices/profileSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

export const OrderStatusPieChart: React.FC = () => {
  const orders = useAppSelector(selectOrders);

  // Count orders by status
  const getOrderStatusCounts = () => {
    const statuses = ['delivered', 'shipped', 'processing', 'pending', 'cancelled'];
    const counts = statuses.map(status => {
      return orders.filter(order => order.status === status).length;
    });
    return counts;
  };

  const data = {
    labels: ['Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Order Status',
        data: getOrderStatusCounts(),
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',   // Delivered - Green
          'rgba(33, 150, 243, 0.8)',   // Shipped - Blue
          'rgba(255, 152, 0, 0.8)',    // Processing - Orange
          'rgba(255, 193, 7, 0.8)',    // Pending - Yellow
          'rgba(244, 67, 54, 0.8)',    // Cancelled - Red
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(244, 67, 54, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="h-[300px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};