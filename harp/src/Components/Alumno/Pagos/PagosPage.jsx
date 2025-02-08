import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getInscripcionesVigentesDeAlumno } from "../../../services/Alumno";
import { obtenerUltimasCuotasDeInscripcion } from "../../../services/Cuota";
import CuotaCard from "../ResumenCuota";

const MisCuotas = () => {
    const { idAlumno } = useParams();
    const [cuotas, setCuotas] = useState([]);

    useEffect(() => {
        const fetchCuotas = async () => {
            try {
                const inscripciones = await getInscripcionesVigentesDeAlumno(idAlumno);
                let todasLasCuotas = [];
                
                for (const inscripcion of inscripciones) {
                    const cuotasInscripcion = await obtenerUltimasCuotasDeInscripcion(
                        inscripcion.servicio.id,
                        inscripcion.id
                    );
                    todasLasCuotas = [...todasLasCuotas, ...cuotasInscripcion];
                }
                setCuotas(todasLasCuotas);
            } catch (error) {
                console.error("Error al obtener las cuotas del alumno:", error);
            }
        };

        fetchCuotas();
    }, [idAlumno]);

    return (
        <div>
            <h2 style={{ textAlign: "center", color: "#1E1B4B", marginTop: "18vh" }}>
                Mis Cuotas
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
                {cuotas.length > 0 ? (
                    cuotas.map((cuota) => (
                        <CuotaCard key={cuota.id} cuota={cuota} idInscripcion={cuota.idInscripcion} idServicio={cuota.idServicio} fetchCuotas={() => {}} />
                    ))
                ) : (
                    <p style={{ textAlign: "center", width: "100%" }}>No hay cuotas disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default MisCuotas;
