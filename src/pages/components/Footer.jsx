import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// Importamos los componentes de iconos que ya estás usando
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Beauty&Co</h5>
            <p className="small">
              Tienda online especializada en productos de calidad para tus necesidades diarias.
            </p>
            <div className="social-icons mt-3">
              {/* Añade la prop 'size' a cada componente de icono */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Visita nuestra página de Facebook">
                <FaFacebook size={32} /> {/* Prueba con 32px */}
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visita nuestra página de Instagram">
                <FaInstagram size={32} /> {/* Prueba con 32px */}
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visita nuestra página de Twitter">
                <FaTwitter size={32} /> {/* Prueba con 32px */}
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="Envíanos un mensaje por WhatsApp">
                <FaWhatsapp size={32} /> {/* Prueba con 32px */}
              </a>
            </div>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/">Inicio</Link></li>
              <li className="mb-2"><Link to="/productos">Productos</Link></li>
              <li className="mb-2"><Link to="/carrito">Carrito</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </Col>

          <Col md={4}>
            <h5>Contacto</h5>
            <address className="small">
              <p className="mb-2">
                <strong>Dirección:</strong> Calle Principal 123, Ciudad
              </p>
              <p className="mb-2">
                <strong>Teléfono:</strong> +1 234 567 890
              </p>
              <p>
                <strong>Email:</strong> info@Beauty&Co.com
              </p>
            </address>
          </Col>
        </Row>

        <Row>
          <Col className="copyright text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Beauty&Co. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;