import { useEffect, useState } from "react";
import { MdFavorite } from "react-icons/md";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  agregarServicioFavoritoAAlumno,
  quitarServicioFavoritoDeAlumno,
} from "../../../services/Alumno";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";

const FavoriteButton = ({
  servicioId,
  serviciosFavoritos,
  setServiciosFavoritos,
}) => {
  const [hovered, setHovered] = useState(false);
  const { idAlumno } = useParams();
  const [agregar, setAgregar] = useState();

  // useEffect para settear agregar en true si el servicio no está en favoritos, si lo está entoces sería quitar
  useEffect(() => {
    const servicioEnFavoritos = serviciosFavoritos.some(
      (servicio) => servicio.id === servicioId
    );
    setAgregar(!servicioEnFavoritos);
    console.log("servicios en favoritos", servicioEnFavoritos);
  }, []);

  // Función que se ejecuta al hacer clic
  const handleClick = async () => {
    if (agregar) {
      await agregarServicioFavoritoAAlumno(idAlumno, servicioId);
      setAgregar(false);
    } else {
      await quitarServicioFavoritoDeAlumno(idAlumno, servicioId);
      setAgregar(true);
      setServiciosFavoritos((prevFavs) =>
        prevFavs.filter((servicio) => servicio.id !== servicioId)
      );
    }
  };

  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick} // Se ejecuta cuando se clickea
      className="flex  text-white overflow-hidden transition-all duration-300"
      initial={{ width: "40px", height: "40px", borderRadius: "50%" }}
      animate={{
        width: hovered ? "200px" : "40px",
        height: "40px",
        borderRadius: hovered ? "40px" : "50%",
        backgroundColor: "#4F46E5",
        border: hovered ? "2px solid white" : "0px solid transparent",
      }}
      style={{
        display: "flex",
        padding: "0 8px",
        position: "relative",
        top: "5px",
      }}
    >
      <motion.span
        className="flex items-center justify-center w-[40px] h-[40px] mr-1"
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          top: agregar ? "-1px" : "2px", 
        }}
      >
        {agregar ? (
          <MdFavorite className="text-white text-[30px]" />
        ) : (
          <FontAwesomeIcon style={{ top: "0" }} icon={faHeartBroken} />
        )}
      </motion.span>
      {hovered && (
        <motion.span
          className="text-white"
          style={{
            whiteSpace: "nowrap", // Forza que el texto siempre se muestre en 1 renglon
            fontSize: "14px",
            padding: "2px 30px",
            fontWeight: "bold",
            display: "flex", // Añadir esta propiedad
            alignItems: "center", // Esto alinea el texto verticalmente
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {agregar ? "Agregar a favoritos" : "Quitar de favoritos"}
        </motion.span>
      )}
    </motion.button>
  );
};

export default FavoriteButton;
