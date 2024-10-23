import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const General = () => {
  // Simulación de datos
  const [paid, setPaid] = useState(20000); // Pagos realizados
  const [pending, setPending] = useState(5000); // Pagos pendientes
  const [expected, setExpected] = useState(0); // Total esperado (Pagos Realizados + Pendientes)
  const [date, setDate] = useState(new Date()); // Fecha en el calendario
  const [courses, setCourses] = useState([
    { title: "Curso de JavaScript", instructor: "Juan Pérez", rating: 4.5 },
    {
      title: "React para Principiantes",
      instructor: "Ana García",
      rating: 4.7,
    },
    { title: "Bases de Datos SQL", instructor: "Carlos López", rating: 4.3 },
  ]); // Cursos simulados
  const [popularCourses, setPopularCourses] = useState([
    { title: "Python Avanzado", rating: 4.9 },
    { title: "Desarrollo Web Completo", rating: 4.8 },
  ]); // Cursos populares simulados
  const [reviews, setReviews] = useState([
    {
      instructor: "Ana García",
      review: "Excelente instructora, explica muy claro!",
    },
    { instructor: "Carlos López", review: "Muy buen curso, me ayudó mucho." },
  ]); // Reseñas simuladas

  // Calcula el total esperado cada vez que cambien los pagos realizados o los pendientes
  useEffect(() => {
    setExpected(paid + pending);
  }, [paid, pending]);

  return (
    <div className="container-fluid">
      {/* Barra de Búsqueda */}
      <div className="row mb-4">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar cursos o instructores..."
          />
        </div>
      </div>

      {/* Mis Cursos y Pagos */}
      <div className="row">
        {/* Sección de Carrusel de Cursos */}
        <div className="col-lg-8 mb-4">
          <h5 className="mb-3" style={{ color: "#240046" }}>
            Mis Cursos
          </h5>
          <Carousel>
            {courses.map((course, index) => (
              <Carousel.Item key={index}>
                <div
                  className="card flex-column justify-content-center align-items-center text-center"
                  style={{
                    backgroundColor: "#4F46E5",
                    color: "#fff",
                    width: "100%",
                    height: "10.6vw",
                    fontSize: "1vw",
                  }}
                >
                  <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
                    <h6 className="card-title">{course.title}</h6>
                    <p className="card-text">Instructor: {course.instructor}</p>
                    <p className="card-text">Calificación: {course.rating}</p>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Sección de Pagos */}
        <div className="col-lg-4 mb-4">
          <h5 className="mb-3" style={{ color: "#240046" }}>
            Estado de Pagos
          </h5>
          <div className="d-flex flex-wrap justify-content-between" style={{ height: "10vw" }}>
            <div
              className="card me-2 mb-2"
              style={{
                backgroundColor: "#5a189a",
                color: "#fff",
                flex: "1 1 30%",
                height: "100%",
              }}
            >
              <div className="card-body text-center d-flex flex-column justify-content-between">
                <h6 className="card-title">Pagados</h6>
                <p className="card-text fs-5 mt-auto">${paid}</p>
              </div>
            </div>

            <div
              className="card me-2 mb-2"
              style={{
                backgroundColor: "#3c096c",
                color: "#fff",
                flex: "1 1 30%",
                height: "100%",
              }}
            >
              <div className="card-body text-center d-flex flex-column justify-content-between">
                <h6 className="card-title">Pendientes</h6>
                <p className="card-text fs-5 mt-auto">${pending}</p>
              </div>
            </div>

            <div
              className="card"
              style={{
                backgroundColor: "#240046",
                color: "#fff",
                flex: "1 1 30%",
                height: "100%",
              }}
            >
              <div className="card-body text-center d-flex flex-column justify-content-between">
                <h6 className="card-title">Total Esperado</h6>
                <p className="card-text fs-5 mt-auto">${expected}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendario, Reseñas y Cursos Populares */}
      <div className="row mb-4">
        <div className="col-lg-4 mb-4">
          <h5 className="mb-3" style={{ color: "#240046" }}>
            Calendario de Pagos
          </h5>
          <Calendar onChange={setDate} value={date} />
        </div>

        <div className="col-lg-4 mb-4">
          <h5 className="mb-3" style={{ color: "#240046" }}>
            Reseñas de Instructores
          </h5>
          {reviews.map((review, index) => (
            <div key={index} className="card mb-2" style={{ backgroundColor: "#e0aaff" }}>
              <div className="card-body">
                <h6>{review.instructor}</h6>
                <p>{review.review}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4 mb-4">
          <h5 className="mb-3" style={{ color: "#240046" }}>
            Cursos Populares
          </h5>
          {popularCourses.map((course, index) => (
            <div key={index} className="card mb-2" style={{ backgroundColor: "#c77dff" }}>
              <div className="card-body">
                <h6>{course.title}</h6>
                <p>Calificación: {course.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default General;
