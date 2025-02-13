package com.harp.backend.entities.servicio;

import com.harp.backend.entities.inscripcion.EstadoInscripcion;
import com.harp.backend.entities.inscripcion.Inscripcion;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class ServicioSpecifications {

    public static Specification<Servicio> alumnoNoInscriptoSpec(Long idAlumno) {
        return (root, query, cb) -> {
            // Evitamos duplicados en caso de joins
            query.distinct(true);

            // Creamos una subconsulta que busca inscripciones para el servicio actual
            Subquery<Inscripcion> subquery = query.subquery(Inscripcion.class);
            Root<Inscripcion> subRoot = subquery.from(Inscripcion.class);
            subquery.select(subRoot);

            // Se asume que la entidad Inscripcion tiene una propiedad "servicio" (relación al Servicio)
            // y una propiedad "alumno" con su id, y un campo "estado"
            Predicate sameServicio = cb.equal(subRoot.get("servicio"), root);
            Predicate mismoAlumno = cb.equal(subRoot.get("alumno").get("id"), idAlumno);
            Predicate estadoEnCurso = cb.equal(subRoot.get("estado"), EstadoInscripcion.EnCurso);
            Predicate estadoAceptada= cb.equal(subRoot.get("estado"), EstadoInscripcion.Aceptada);
            Predicate estadoPendienteAceptacion = cb.equal(subRoot.get("estado"), EstadoInscripcion.PendienteAceptacion);
            Predicate estadoAlumno = cb.or(estadoEnCurso, estadoAceptada, estadoPendienteAceptacion);

            subquery.where(cb.and(sameServicio, mismoAlumno, estadoAlumno));

            // La condición es que NO exista ninguna inscripción para el alumno en ese servicio
            return cb.not(cb.exists(subquery));
        };
    }

    public static Specification<Servicio> nombreContains(String nombre) {
        return (root, query, cb) -> {
            if (nombre == null || nombre.isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("nombre")), "%" + nombre.toLowerCase() + "%");
        };
    }

    public static Specification<Servicio> claseDePruebaGratis(Boolean conClaseGratis) {
        return (root, query, cb) -> {
            if (conClaseGratis == null || conClaseGratis.equals(false)) {
                return cb.conjunction();
            }
            return cb.equal(root.get("claseDePrueba"), conClaseGratis);
        };
    }

    public static Specification<Servicio> categoriaEquals(String categoriaNombre) {
        return (root, query, cb) -> {
            if (categoriaNombre == null || categoriaNombre.isEmpty()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("categoria").get("nombre"), categoriaNombre);
        };
    }

    public static Specification<Servicio> modalidadClasesEquals(String modalidadNombre) {
        return (root, query, cb) -> {
            if (modalidadNombre == null || modalidadNombre.isEmpty()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("modalidadClases"), modalidadNombre);
        };
    }

    public static Specification<Servicio> estadoEquals(EstadoServicio estadoServicio) {
        return (root, query, cb) -> {
            if (estadoServicio == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("estado"), estadoServicio);
        };
    }
//
//    public static Specification<Servicio> cuposLibresGreaterThan(Integer cupos) {
//        return (root, query, cb) -> {
//            if (cupos == null) {
//                return cb.conjunction();
//            }
//            return cb.greaterThanOrEqualTo(root.get("cuposLibres"), cupos);
//        };
//    }

//    public static Specification<Servicio> instructorEquals(Long instructorId) {
//        return (root, query, cb) -> {
//            if (instructorId == null) {
//                return cb.conjunction();
//            }
//            return cb.equal(root.get("instructor").get("id"), instructorId);
//        };
//    }

    public static Specification<Servicio> ubicacionContains(String ubicacion) {
        return (root, query, cb) -> {
            if (ubicacion == null || ubicacion.isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("ubicacion")), "%" + ubicacion.toLowerCase() + "%");
        };
    }

    public static Specification<Servicio> inscripcionesAbiertasSpec() {
        return (root, query, cb) ->  cb.isTrue(root.get("inscripcionesAbiertas"));
    }

}

