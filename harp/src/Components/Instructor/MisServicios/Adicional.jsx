import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Adicional = () => {
  // Datos de ejemplo para los ingresos y lo pendiente
  const currentMonthIncome = 5000; // Monto que se ingresó este mes
  const pendingIncome = 3000; // Monto pendiente de ingresarse este mes

  // Datos para el gráfico de barras
  const barData = {
    labels: ["Ingresos Este Mes", "Pendiente Este Mes"],
    datasets: [
      {
        label: "Monto ($)",
        data: [currentMonthIncome, pendingIncome],
        backgroundColor: ["#4B8DF8", "#FF6384"], // Diferentes colores para cada barra
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Para controlar el tamaño manualmente
    plugins: {
      legend: {
        display: false, // Desactivar la leyenda
      },
    },
  };

  return (
    <div style={{ padding: "5px", borderRadius: "5px", marginTop: "20px", width: "90%"}}>
      <h4 style={{ textAlign: "center", fontSize: "1.2rem" }}>Resumen de Ingresos del Mes</h4>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
        {/* Monto total ingresado y pendiente */}
        <div style={{ display: "flex", gap: "30px", marginBottom: "15px" }}>
          <div>
            <h5>Ingresos Este Mes</h5>
            <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#4B8DF8" }}>${currentMonthIncome}</p>
          </div>
          <div>
            <h5>Pendiente de Ingreso</h5>
            <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#FF6384" }}>${pendingIncome}</p>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div style={{ width: "100%", height: "200px" }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default Adicional;
