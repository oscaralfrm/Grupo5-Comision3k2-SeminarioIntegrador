import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Title, Tooltip, Legend);

const GraficoDeTorta = () => {
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
      {/* Contenedor solo con el gráfico de pastel */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Gráfico de Pastel */}
        <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
          <h4 style={{ textAlign: "center" }}>Inscripciones por Categoría</h4>
          <Pie data={pieData} options={pieOptions} width={600} height={300} />
        </div>
      </div>
    </div>
  );
};

export default GraficoDeTorta;
