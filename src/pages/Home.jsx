import React from 'react';
import { Helmet } from 'react-helmet';
import Carousel from 'react-bootstrap/Carousel';

const APP_CONFIG = {
  name: "Beauty&Co",
  slogan: "Tu belleza, nuestra ciencia",
  description: "Descubre los mejores productos de maquillaje, skincare y cuidado personal"
};

const carouselImages = [
  {
    src: '/carru1.jpg',
    alt: 'Productos de Maquillaje y Belleza',
    
  },
  {
    src: '/carru2.jpg',
    alt: 'Rutina de Skincare y Cuidado de la Piel',
    objectPosition: '50% 30%',
    caption: { 
      title: '¡Tu rutina perfecta!',
      text: 'Cuidado de la piel diseñado para ti'
    }
  },
  {
    src: '/carru3.jpg',
    alt: 'Artículos de Cuidado Personal y Bienestar',
    
  }
];

const Home = () => {
  return (
    <section className="home-page">
      <Helmet>
        <title>{`${APP_CONFIG.name} - Inicio`}</title>
        <meta name="description" content={APP_CONFIG.description} />
      </Helmet>

      <div className="mb-5">
        <Carousel fade interval={5000} pause="hover">
          {carouselImages.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 rounded shadow-sm"
                src={image.src}
                alt={image.alt}
                style={{
                  maxHeight: '500px',
                  objectFit: 'cover',
                  objectPosition: image.objectPosition || 'center'
                }}
              />
              {/* Solo muestra caption si existe */}
              {image.caption && (
                <Carousel.Caption className="text-white text-shadow-md bg-dark bg-opacity-50 rounded p-3">
                  <h3 className="text-3xl font-bold">{image.caption.title}</h3>
                  <p className="text-lg">{image.caption.text}</p>
                </Carousel.Caption>
              )}
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className="container my-5 text-center">
        <h2 className="display-4 mb-3">Bienvenido a {APP_CONFIG.name}</h2>
        <p className="lead">{APP_CONFIG.slogan}</p>
      </div>
    </section>
  );
};

export default Home;