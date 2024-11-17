import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGruposDeServicio } from '../../../../services/Grupo.js'; // Importa tu servicio aquí
import { editHorario } from '../../../../services/Horario.js';

const isHorarioSuperpuesto = (nuevoHorario, horariosExistentes) => {
    console.log(horariosExistentes);
    return horariosExistentes.some((horario) => {
        console.log("1", horario.diaSemana.nombre);
        console.log("2", nuevoHorario.nombreDiaSemana);
      const mismoDia = horario.diaSemana.nombre === nuevoHorario.nombreDiaSemana;
  
      const inicioDentroDeRango =
      nuevoHorario.horaInicio > horario.horaInicio &&
      nuevoHorario.horaFin >= horario.horaFin &&
      nuevoHorario.horaInicio < horario.horaFin;
      const finDentroDeRango =
        nuevoHorario.horaFin <= horario.horaFin &&
        nuevoHorario.horaInicio < horario.horaInicio &&
        nuevoHorario.horaFin > horario.horaInicio;
      const abarcaElOtro =
        nuevoHorario.horaInicio < horario.horaInicio &&
        nuevoHorario.horaFin > horario.horaFin;
  
      const exactamenteIgual =
        nuevoHorario.horaInicio === horario.horaInicio &&
        nuevoHorario.horaFin === horario.horaFin;
  
        console.log("inicioDentroRango", inicioDentroDeRango, "fin", finDentroDeRango, "abarca", abarcaElOtro, "exac", exactamenteIgual);
      // Devuelve true si hay una superposición o son exactamente iguales
      return (
        mismoDia &&
        (inicioDentroDeRango || finDentroDeRango || abarcaElOtro || exactamenteIgual)
      );
    });
  };
  
  

const Configuracion = () => {
  const [grupos, setGrupos] = useState([]);
  const [editingHorarioId, setEditingHorarioId] = useState(null);
  const [editedHorario, setEditedHorario] = useState({});
  const navigate = useNavigate();
  const { idServicio } = useParams();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const data = await getGruposDeServicio(idServicio);
        setGrupos(data);
      } catch (error) {
        console.error('Error al traer los grupos:', error);
      }
    };
    fetchGrupos();
  }, [idServicio]);

  const handleAgregarGrupo = () => {
    navigate('/crear-grupo'); // Redirige al componente de creación de grupos
  };

  const handleEditHorario = (horario) => {
    // Si ya hay un horario en edición, cancela la edición actual
    if (editingHorarioId && editingHorarioId !== horario.id) {
      alert("Guarda o cancela la edición actual antes de modificar otro horario.");
      return;
    }
    // Iniciar la edición del horario seleccionado
    setEditingHorarioId(horario.id);
    setEditedHorario({
        id: horario.id,
        nombreDiaSemana: horario.diaSemana.nombre, // Aseguramos que este sea el valor inicial del día
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
      });
 }

 const [validationError, setValidationError] = useState("");

const handleHorarioChange = (field, value) => {
  setEditedHorario((prev) => {
    const updatedHorario = { ...prev, [field]: value };


    // Obtener todos los horarios de todos los grupos
    const horariosExistentes = grupos.flatMap((grupo) => grupo.horarios);
      // Validar superposición
    const haySuperposicion = isHorarioSuperpuesto(updatedHorario, horariosExistentes);
  
      if (haySuperposicion) {
        setValidationError("Hay superposición con otro horario existente.");
        console.log("hau superposicion");
     } else {
        setValidationError("");
     }

    // Validaciones
    if (field === "horaInicio" || field === "horaFin") {
      const { horaInicio, horaFin } = updatedHorario;

      // Validar que horaInicio sea menor que horaFin
      if (horaInicio >= horaFin) {
        setValidationError("La hora de inicio debe ser menor que la hora de fin.");
      } 
      // Validar que la diferencia sea al menos 30 minutos
      else if (
        horaInicio &&
        horaFin &&
        new Date(`1970-01-01T${horaFin}:00`) - new Date(`1970-01-01T${horaInicio}:00`) < 30 * 60 * 1000
      ) {
        setValidationError("La diferencia entre las horas debe ser de al menos 30 minutos.");
      } 
      // Sin errores
      else {
        if (! haySuperposicion) {
            setValidationError("");
        }
      }
    }

    return updatedHorario;
  });
};

  const handleSaveHorario = async () => {
    if (validationError) {
        alert("Corrige los errores antes de guardar.");
        return;
      }
    try {
      const horarioParaGuardar = {
        id: editedHorario.id,
        nombreDiaSemana: editedHorario.nombreDiaSemana,
        horaInicio: editedHorario.horaInicio,
        horaFin: editedHorario.horaFin,
      };
  
      // Obtener todos los horarios de todos los grupos
      const horariosExistentes = grupos.flatMap((grupo) => grupo.horarios);
  
      // Validar superposición
      const haySuperposicion = isHorarioSuperpuesto(horarioParaGuardar, horariosExistentes);
  
      if (haySuperposicion) {
        setValidationError("Hay superposición con otro horario existente.");
        return;
      }
  
      // Enviar los datos al backend
      await editHorario(horarioParaGuardar.id, horarioParaGuardar);
  
      // Recargar los datos desde el servidor
      const updatedGrupos = await getGruposDeServicio(idServicio);
      setGrupos(updatedGrupos);
  
      // Salir del modo edición
      setEditingHorarioId(null);
    } catch (error) {
      console.error("Error al guardar el horario:", error);
    }
  };
  

  const handleCancelEdit = () => {
    // Salir del modo de edición y limpiar los datos del horario editado
    setEditingHorarioId(null);
    setEditedHorario({});
  };

  const gruposIndividuales = grupos.filter((grupo) => grupo.cantMaxAlumnos === 1);
  const gruposGrupales = grupos.filter((grupo) => grupo.cantMaxAlumnos > 1);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Grupos</h1>
      <div className="row">
        {/* Individuales */}
        {gruposIndividuales.length > 0 && (
          <div className="col-md-6">
            <h3 className="text-start">Clases individuales</h3>
            <div className="row">
              {gruposIndividuales.map((grupo, index) => (
                <div className="col-md-12 mb-4 d-flex align-items-stretch" key={index}>
                  <div className="card" style={{ width: '100%' }}>
                    <div className="card-body">
                      <h5 className="card-title text-center">{grupo.nombre}</h5>
                      <ul className="list-group mt-3">
                        {grupo.horarios.map((horario, idx) => (
                          <li
                          className="list-group-item d-flex flex-wrap align-items-center justify-content-between"
                          key={idx}
                          style={{ gap: '0.5rem' }} // Espacio entre elementos
                        >
                          {editingHorarioId === horario.id ? (
                            <>
                              <div className="d-flex flex-wrap align-items-center w-100" style={{ gap: '0.5rem' }}>
  {/* Selector del día */}
  <select
    className="form-select form-select-sm"
    value={editedHorario.nombreDiaSemana}
    onChange={(e) => handleHorarioChange("nombreDiaSemana", e.target.value)}
    style={{ minWidth: '120px' }}
  >
    <option value="Lunes">Lunes</option>
    <option value="Martes">Martes</option>
    <option value="Miércoles">Miércoles</option>
    <option value="Jueves">Jueves</option>
    <option value="Viernes">Viernes</option>
    <option value="Sábado">Sábado</option>
    <option value="Domingo">Domingo</option>
  </select>

  {/* Hora de inicio */}
  <input
    type="time"
    className="form-control form-control-sm"
    value={editedHorario.horaInicio}
    onChange={(e) => handleHorarioChange("horaInicio", e.target.value)}
    style={{ minWidth: '110px' }}
  />

  {/* Hora de fin */}
  <input
    type="time"
    className="form-control form-control-sm"
    value={editedHorario.horaFin}
    onChange={(e) => handleHorarioChange("horaFin", e.target.value)}
    style={{ minWidth: '110px' }}
  />
</div>

{/* Mensaje de error */}
{validationError && (
  <p className="text-danger mt-2">{validationError}</p>
)}

                        
                              {/* Contenedor de botones */}
                              <div className="d-flex justify-content-end w-100 mt-2">
                                <button
                                  className="btn btn-success btn-sm me-2"
                                  onClick={handleSaveHorario}
                                  style={{ minWidth: '80px' }} // Tamaño mínimo para el botón
                                >
                                  Guardar
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={handleCancelEdit}
                                  style={{ minWidth: '80px' }} // Tamaño mínimo para el botón
                                >
                                  Cancelar
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex-grow-1">
                                <strong>{horario.diaSemana.nombre}</strong>: {horario.horaInicio} -{" "}
                                {horario.horaFin}
                              </div>
<button
  className="btn btn-sm btn-outline-secondary"
  title="Editar horario"
  onClick={() => handleEditHorario(horario)}
  disabled={editingHorarioId && editingHorarioId !== horario.id} // Bloquear otros botones
>
  <i className="bi bi-pencil-fill"></i>
</button>
                            </>
                          )}
                        </li>
                        
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
{gruposGrupales.length > 0 && (
  <div className="col-md-6">
    <h3 className="text-start">Clases grupales</h3>
    <div className="row">
      {gruposGrupales.map((grupo, index) => (
        <div className="col-md-12 mb-4 d-flex align-items-stretch" key={index}>
          <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
              <h5 className="card-title text-center">{grupo.nombre}</h5>
              <ul className="list-group mt-3">
                {grupo.horarios.map((horario, idx) => (
                  <li
                    className="list-group-item d-flex flex-wrap align-items-center justify-content-between"
                    key={idx}
                    style={{ gap: '0.5rem' }} // Espacio entre elementos
                  >
                    {editingHorarioId === horario.id ? (
                      <>
                        <div className="d-flex flex-wrap align-items-center w-100" style={{ gap: '0.5rem' }}>
                          {/* Selector del día */}
                          <select
                            className="form-select form-select-sm"
                            value={editedHorario.nombreDiaSemana}
                            onChange={(e) => handleHorarioChange("nombreDiaSemana", e.target.value)}
                            style={{ minWidth: '120px' }}
                          >
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                          </select>

                          {/* Hora de inicio */}
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={editedHorario.horaInicio}
                            onChange={(e) => handleHorarioChange("horaInicio", e.target.value)}
                            style={{ minWidth: '110px' }}
                          />

                          {/* Hora de fin */}
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={editedHorario.horaFin}
                            onChange={(e) => handleHorarioChange("horaFin", e.target.value)}
                            style={{ minWidth: '110px' }}
                          />
                        </div>

                        {/* Mensaje de error */}
                        {validationError && (
                          <p className="text-danger mt-2">{validationError}</p>
                        )}

                        {/* Contenedor de botones */}
                        <div className="d-flex justify-content-end w-100 mt-2">
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={handleSaveHorario}
                            style={{ minWidth: '80px' }}
                          >
                            Guardar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={handleCancelEdit}
                            style={{ minWidth: '80px' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-grow-1">
                          <strong>{horario.diaSemana.nombre}</strong>: {horario.horaInicio} -{" "}
                          {horario.horaFin}
                        </div>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          title="Editar horario"
                          onClick={() => handleEditHorario(horario)}
                          disabled={editingHorarioId && editingHorarioId !== horario.id} // Bloquear otros botones
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </div>

      {/* Agregar grupo */}
      <div className="row mt-4">
        <div className="col-md-4 offset-md-4">
          <div
            className="card text-center border border-primary h-100"
            onClick={handleAgregarGrupo}
            style={{ cursor: 'pointer', width: '100%' }}
          >
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title text-primary">
                <i className="bi bi-plus-circle"></i> Agregar nuevo grupo
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
