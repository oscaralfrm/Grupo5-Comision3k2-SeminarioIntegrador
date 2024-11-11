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
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <h3>Estadísticas</h3>
      <div style={{ display: "flex", gap: "40px", flexDirection: "row", justifyContent: "center" }}>
        {/* Gráfico de Barras */}
        <div style={{ width: "300px", height: "200px" }}>
          <h4 style={{ textAlign: "center" }}>Ganancias Mensuales</h4>
          <Bar data={barData} options={barOptions} width={300} height={200} />
        </div>

        {/* Gráfico de Pastel */}
        <div style={{ width: "300px", height: "200px" }}>
          <h4 style={{ textAlign: "center" }}>Inscripciones por Categoría</h4>
          <Pie data={pieData} options={pieOptions} width={300} height={200} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
