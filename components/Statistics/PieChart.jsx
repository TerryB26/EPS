import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ Data }) => {
  const data = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Leave Requests',
        data: [Data.pending, Data.approved, Data.rejected],
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)', 
          'rgba(54, 162, 235, 0.2)', 
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)', 
          'rgba(54, 162, 235, 1)', 
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Leave Requests Distribution',
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;