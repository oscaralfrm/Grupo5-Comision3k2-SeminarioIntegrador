import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Statistics = () => {
  // Datos para el gráfico de barras
  const barData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Ganancias Mensuales ($)",
        data: [1200, 1900, 3000, 5000, 2500],
        backgroundColor: "#4B8DF8",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Para controlar el tamaño manualmente
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  // Datos para el gráfico de pastel
  const pieData = {
    labels: ["Programación", "Negocios", "Arte"],
    datasets: [
      {
        label: "Cursos Inscritos",
        data: [10, 8, 7],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Para controlar el tamaño manualmente
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div style={{ padding: "20px", borderRadius: "8px" }}>
      <h3>Estadísticas</h3>
      {/* Contenedor con los gráficos apilados */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {/* Gráfico de Barras */}
        <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
          <h4 style={{ textAlign: "center" }}>Ganancias Mensuales</h4>
          <Bar data={barData} options={barOptions} width={600} height={300} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
