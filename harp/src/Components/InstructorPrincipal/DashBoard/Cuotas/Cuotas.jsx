import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cuotas = ({ service }) => {
    const navigate = useNavigate();
    const cuotasHeadings = [["Id", "Alumno", "Grupo", "Fecha Inicio Ciclo", "Fecha Fin Ciclo", "Fecha Límite Pago", "Fecha Pago Cuota", "Estado Cuota", "Monto Cuota"]];
    const cuotas = [
        ["1", "Juan Perez", "1", "---", "---", "---", "---", "Pendiente", "$30,000"]
    ];

    const handleRowClick = (cuota) => {
        navigate(`detalle-cuota/${cuota[0]}`);
    };

    return (
        <div className="container-fluid" style={{marginTop: '-7vw'}} >
            <h1 className="text-center mb-4">Cuotas de {service}</h1>
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="thead-light">
                        <tr>
                            {cuotasHeadings[0].map((heading, index) => (
                                <th scope="col" key={index}>{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {cuotas.map((cuota, index) => (
                            <tr key={index} onClick={() => handleRowClick(cuota)} style={{ cursor: 'pointer' }}>
                                {cuota.map((elem, elemIndex) => (
                                    <td key={elemIndex}>{elem}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Cuotas;
