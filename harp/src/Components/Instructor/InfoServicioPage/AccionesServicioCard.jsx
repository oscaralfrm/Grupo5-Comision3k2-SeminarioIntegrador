// components/ActionSection.js
import React from "react";
import { Button, Card } from "react-bootstrap";
import { deleteServicio } from "../../../services/Servicio";
import { useNavigate, useParams } from "react-router-dom";

function ActionSection({ serviceData, cantGrupos }) {

    const navigate = useNavigate();
    const { idInstructor } = useParams();

    const handleViewActivity = () => {
        alert("Ver actividad no está implementado aún.");
    };

    const onPublish = async () => {
        // Lógica para publicar el servicio
        console.log("Service data", serviceData);
        console.log("Publicar servicio");
    };

    const onDelete = async () => {
        await deleteServicio(serviceData?.id);
        alert("Servicio eliminado");
        navigate(`/instructor/${idInstructor}/servicios`)

    };

    const onFinalizar = async () => {
        // Lógica para suspender el servicio
        console.log("Servicio finalizado");
    };


    const onSuspend = async () => {
        // Lógica para suspender el servicio
        console.log("Servicio suspendido");
    };

    return (
        <Card className="p-3">
            <Button variant="primary" className="mb-2" onClick={handleViewActivity}>
                Ver Actividad
            </Button>
            {serviceData?.inscripcionesAbiertas ? (
                <Button variant="secondary" className="mb-2" onClick={onSuspend}>
                    Suspender
                </Button>
            ) : (
                <Button variant="success" className="mb-2" onClick={onPublish}>
                    Publicar
                </Button>
            )}
            {cantGrupos == 0 && !serviceData.publico &&
                <Button variant="danger" onClick={onDelete}>
                    Eliminar
                </Button>
            }
            {serviceData.publico &&
                <Button variant="secondary" className="mb-2" onClick={onFinalizar}>
                    Finalizar
                </Button>
            }


        </Card>
    );
}

export default ActionSection;
