import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppSelector } from '../../store/hooks';
import { selectOrders } from '../../store/slices/profileSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OrderBarChartProps {
  height?: string;
}

export const OrderBarChart: React.FC<OrderBarChartProps> = ({ height = '100%' }) => {
  const orders = useAppSelector(selectOrders);

  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
  };

  const getOrdersPerDay = () => {
    const days = getLast7Days();
    const counts = days.map(day => {
      return orders.filter(order => {
        const orderDate = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return orderDate === day;
      }).length;
    });
    return counts;
  };

  const data = {
    labels: getLast7Days(),
    datasets: [
      {
        label: 'Orders',
        data: getOrdersPerDay(),
        backgroundColor: 'rgba(79, 195, 247, 0.6)',
        borderColor: 'rgba(79, 195, 247, 1)',
        borderWidth: 2,
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
};