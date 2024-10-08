import React from 'react';
import { useParams } from 'react-router-dom';

const DetalleCuota = () => {
    const { cuotaId } = useParams(); // Obtiene el parámetro de la URL

    // SE TRAE DEL BACK LA CUOTA CON ESE ID 
    const cuotaDetails = {
        "1": {
            alumno: "Juan Perez",
            grupo: "1",
            fechaInicioCiclo: "2023-01-01",
            fechaFinCiclo: "2023-12-31",
            fechaLimitePago: "2023-02-01",
            fechaPagoCuota: "2023-01-15",
            estadoCuota: "Pagada",
            montoCuota: "$30,000"
        }
    };

    // Obtenemos los detalles de la cuota correspondiente al alumnoId
    const cuota = cuotaDetails[cuotaId];

    if (!cuota) {
        return <div className="container mt-4"><h2>Detalles no encontrados.</h2></div>;
    }

    return (
        <div className="container mt-4">
            <h2>Detalle Cuota {cuota.alumno}</h2>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th>Grupo</th>
                        <td>{cuota.grupo}</td>
                    </tr>
                    <tr>
                        <th>Fecha Inicio Ciclo</th>
                        <td>{cuota.fechaInicioCiclo}</td>
                    </tr>
                    <tr>
                        <th>Fecha Fin Ciclo</th>
                        <td>{cuota.fechaFinCiclo}</td>
                    </tr>
                    <tr>
                        <th>Fecha Límite Pago</th>
                        <td>{cuota.fechaLimitePago}</td>
                    </tr>
                    <tr>
                        <th>Fecha Pago Cuota</th>
                        <td>{cuota.fechaPagoCuota}</td>
                    </tr>
                    <tr>
                        <th>Estado Cuota</th>
                        <td>{cuota.estadoCuota}</td>
                    </tr>
                    <tr>
                        <th>Monto Cuota</th>
                        <td>{cuota.montoCuota}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DetalleCuota;
