import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import ServiceHeader from "./SeviceHeader";

const InfoServicioPage = () => {
    return (
        <div className="container mt-4">
          {/* Service Header */}
          <ServiceHeader />
    
          {/* Add more components here as we build them */}
        </div>
      );
    }

export default InfoServicioPage;