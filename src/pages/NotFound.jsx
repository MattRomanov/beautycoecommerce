import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const NotFound = () => {
  return (
    <Container className="not-found-container d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Helmet>
        <title>Mi Tienda Online - Página No Encontrada</title>
        <meta name="description" content="Lo sentimos, la página que buscas no existe." />
      </Helmet>
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <p className="fs-3">¡Ups! Página no encontrada</p>
        <p className="lead text-muted">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Button
          as={Link}
          to="/"
          variant="primary"
          size="lg"
          className="mt-3"
          aria-label="Volver a la página de inicio"
        >
          ← Volver al inicio
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;