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

export const SpendingBarChart: React.FC = () => {
  const orders = useAppSelector(selectOrders);

  const getLast6Months = () => {
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(monthNames[date.getMonth()]);
    }
    return months;
  };

  const getSpendingPerMonth = () => {
    const months = getLast6Months();
    const spending = months.map((month, index) => {
      const monthIndex = new Date().getMonth() - (5 - index);
      const year = new Date().getFullYear();
      return orders
        .filter(order => {
          const orderDate = new Date(order.date);
          return orderDate.getMonth() === monthIndex && 
                 orderDate.getFullYear() === year &&
                 order.status === 'delivered';
        })
        .reduce((total, order) => total + order.total, 0);
    });
    return spending;
  };

  const data = {
    labels: getLast6Months(),
    datasets: [
      {
        label: 'Spending ($)',
        data: getSpendingPerMonth(),
        backgroundColor: 'rgba(79, 195, 247, 0.6)',
        borderColor: 'rgba(79, 195, 247, 1)',
        borderWidth: 2,
        borderRadius: 6,
        maxBarThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'Monthly Spending (Last 6 Months)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};