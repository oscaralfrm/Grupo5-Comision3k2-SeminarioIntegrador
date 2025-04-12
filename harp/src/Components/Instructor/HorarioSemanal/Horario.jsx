import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiciosVigentesDeInstructor } from '../../../services/Instructor';
import { getGruposDeServicio } from '../../../services/Grupo';

const Horario = () => {
  const { idInstructor } = useParams();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const hourHeight = 50;
  const colors = [
    "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9",
    "#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2",
    "#B2DFDB", "#C8E6C9", "#DCEDC8", "#F0F4C3",
    "#FFECB3", "#FFE0B2", "#FFCCBC", "#D7CCC8",
    "#F5F5F5", "#CFD8DC"
  ];
  
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const serviciosData = await getServiciosVigentesDeInstructor(idInstructor);
        const serviciosConGrupos = await Promise.all(
          serviciosData.map(async (servicio) => {
            const grupos = await getGruposDeServicio(servicio.id);
            return { ...servicio, grupos };
          })
        );
        setServicios(serviciosConGrupos);
      } catch (error) {
        console.error("Error al obtener servicios del instructor:", error);
      }
    };
    fetchServicios();
  }, [idInstructor]);
  
  const parseTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    return hour + minute / 60;
  };

  const rawEvents = [];
  servicios.forEach((servicio, sIndex) => {
    if (servicio.grupos && Array.isArray(servicio.grupos)) {
      servicio.grupos.forEach((grupo, gIndex) => {
        if (grupo.horarios && Array.isArray(grupo.horarios)) {
          grupo.horarios.forEach((horario) => {
            const dayName = horario.diaSemana.nombre;
            const dayIndex = days.indexOf(dayName);
            if (dayIndex !== -1) {
              const start = parseTime(horario.horaInicio);
              const end = parseTime(horario.horaFin);
              const color = colors[(sIndex + gIndex) % colors.length];
              rawEvents.push({
                servicioNombre: servicio.nombre,
                grupoNombre: grupo.nombre,
                servicioId: servicio.id, // Agregamos el ID del servicio
                dayIndex,
                start,
                end,
                color
              });
            }
          });
        }
      });
    }
  });
  
  const allStartTimes = rawEvents.map(event => event.start);
  const allEndTimes = rawEvents.map(event => event.end);
  const gridStartHour = allStartTimes.length > 0 ? Math.floor(Math.min(...allStartTimes)) : 6;
  const gridEndHour = allEndTimes.length > 0 ? Math.ceil(Math.max(...allEndTimes)) : 22;
  const gridHeight = (gridEndHour - gridStartHour) * hourHeight;
  
  let layoutEvents = [];
  for (let day = 0; day < 7; day++) {
    const dayEvents = rawEvents.filter(ev => ev.dayIndex === day);
    dayEvents.sort((a, b) => a.start - b.start);
    
    let clusters = [];
    dayEvents.forEach(ev => {
      if (clusters.length === 0) {
        clusters.push([ev]);
      } else {
        let lastCluster = clusters[clusters.length - 1];
        const clusterMaxEnd = Math.max(...lastCluster.map(e => e.end));
        if (ev.start < clusterMaxEnd) {
          lastCluster.push(ev);
        } else {
          clusters.push([ev]);
        }
      }
    });
    
    clusters.forEach(cluster => {
      let columns = [];
      cluster.forEach(ev => {
        let placed = false;
        for (let i = 0; i < columns.length; i++) {
          if (ev.start >= columns[i]) {
            ev.col = i;
            columns[i] = ev.end;
            placed = true;
            break;
          }
        }
        if (!placed) {
          ev.col = columns.length;
          columns.push(ev.end);
        }
      });
      const totalCols = columns.length;
      cluster.forEach(ev => { ev.totalCols = totalCols; });
      layoutEvents.push(...cluster);
    });
  }
  
  const events = layoutEvents.map(event => ({
    ...event,
    top: (event.start - gridStartHour) * hourHeight,
    height: (event.end - event.start) * hourHeight
  }));
  
  const containerStyle = {
    width: "100%",
    overflowX: "auto",
    fontFamily: "Roboto, sans-serif"
  };
  
  const scheduleContainerStyle = {
    position: "relative",
    border: "1px solid #ccc",
    height: gridHeight,
    marginLeft: 60,
    backgroundColor: "#f7f7f7",
    borderRadius: 4,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };
  
  const timeColumnStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    width: 60,
    height: gridHeight,
    borderRight: "1px solid #ccc"
  };
  
  const timeLabelStyle = {
    position: "absolute",
    left: 0,
    width: 60,
    textAlign: "right",
    paddingRight: 5,
    fontSize: "12px"
  };
  
  const dayHeaderContainerStyle = {
    display: "flex",
    marginLeft: 60,
    borderBottom: "1px solid #ccc"
  };
  
  const dayHeaderStyle = {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    padding: "5px 0",
    borderRight: "1px solid #ccc"
  };
  
  const verticalLines = [];
  for (let i = 1; i < 7; i++) {
    verticalLines.push(
      <div
        key={`vline-${i}`}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${(i * 100) / 7}%`,
          borderLeft: "1px dashed #ccc",
          pointerEvents: "none"
        }}
      />
    );
  }
  
  const eventStyle = (event) => {
    const dayWidthPercent = 100 / 7;
    const leftPercent = (event.dayIndex) * dayWidthPercent + (event.col * (dayWidthPercent / event.totalCols));
    const widthPercent = dayWidthPercent / event.totalCols;
    return {
      position: "absolute",
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
      top: event.top,
      height: event.height,
      backgroundColor: event.color,
      border: "1px solid #999",
      borderRadius: "4px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      boxSizing: "border-box",
      padding: "2px",
      cursor: "pointer",
      fontSize: "12px"
    };
  };
  
  const timeLabels = [];
  const hourLines = [];
  for (let h = gridStartHour; h <= gridEndHour; h++) {
    timeLabels.push(
      <div key={h} style={{ ...timeLabelStyle, top: (h - gridStartHour) * hourHeight - 7 }}>
        {h}:00
      </div>
    );
    hourLines.push(
      <div key={h} style={{
        position: "absolute",
        top: (h - gridStartHour) * hourHeight,
        left: 0,
        right: 0,
        borderTop: "1px dashed #ccc",
        pointerEvents: "none"
      }} />
    );
  }
  
  const handleEventClick = (event) => {
    navigate(`/instructor/${idInstructor}/servicio/${event.servicioId}/mi-servicio`);
  };

  return (
    <Container style={{ marginTop: "130px", marginBottom: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", fontFamily: "Roboto, sans-serif" }}>
        Horario Semanal
      </h2>
      
      <div style={containerStyle}>
        <div style={dayHeaderContainerStyle}>
          {days.map((day, index) => (
            <div
              key={index}
              style={{
                ...dayHeaderStyle,
                borderRight: index < days.length - 1 ? "1px solid #ccc" : "none"
              }}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div style={{ position: "relative" }}>
          <div style={timeColumnStyle}>
            {timeLabels}
          </div>
          
          <div style={scheduleContainerStyle}>
            {hourLines}
            {verticalLines}
            {events.map((event, index) => (
              <div
                key={index}
                style={eventStyle(event)}
                onClick={() => handleEventClick(event)}
              >
                <div style={{ fontWeight: "bold" }}>{event.servicioNombre}</div>
                <div>{event.grupoNombre}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Horario;