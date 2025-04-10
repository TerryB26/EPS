import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarGraph = ({ Data }) => {
  const data = {
    labels: ["Departments", "Divisions", "Job Titles", "Roles", "Employees"],
    datasets: [
      {
        label: "Counts",
        data: [
          Data.total_departments,
          Data.total_divisions,
          Data.total_jobtitles,
          Data.total_roles,
          Data.total_employees,
        ], 
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)", 
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)", 
          "rgba(54, 162, 235, 0.2)", 
          "rgba(255, 99, 132, 0.2)", 
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", 
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)", 
          "rgba(54, 162, 235, 1)", 
          "rgba(255, 99, 132, 1)", 
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
        position: "top",
      },
      title: {
        display: true,
        text: "Organizational Overview",
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1, 
          precision: 0, 
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;