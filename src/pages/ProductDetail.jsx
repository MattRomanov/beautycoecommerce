import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const allProducts = await getProducts();
        const foundProduct = allProducts.find(p => p.id === id);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Producto no encontrado.');
          toast.error('Producto no encontrado', {
            toastId: 'product-not-found',
            position: 'top-center'
          });
        }
      } catch (err) {
        console.error("Error al cargar el detalle del producto:", err);
        setError('Error al cargar el detalle del producto. Inténtalo de nuevo más tarde.');
        toast.error('Error al cargar detalle del producto', {
          toastId: 'product-detail-error',
          position: 'top-center'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      await addItem(product);
      toast.success(`¡${product.nombre} añadido al carrito!`, {
        toastId: `add-${product.id}`,
        position: 'top-center',
        autoClose: 2000,
        style: {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          maxWidth: '90%'
        }
      });
    } catch (error) {
      toast.error('Error al agregar al carrito', {
        toastId: `add-error-${product.id}`,
        position: 'top-center'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5" role="status" aria-live="polite">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando producto...</span>
        </div>
        <p className="mt-2">Cargando detalle del producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-5" role="alert" aria-live="assertive">
        {error}
        <p className="mt-3">
          <Link to="/productos" className="btn btn-primary" aria-label="Volver a la página de productos">
            Volver a Productos
          </Link>
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="alert alert-warning text-center my-5" role="alert" aria-live="polite">
        Producto no disponible.
        <p className="mt-3">
          <Link to="/productos" className="btn btn-primary" aria-label="Volver a la página de productos">
            Volver a Productos
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container my-5" aria-labelledby="product-detail-heading">
      <Helmet>
        <title>Mi Tienda Online - {product.nombre}</title>
        <meta name="description" content={`Detalles de ${product.nombre}: ${product.descripcion.substring(0, 150)}...`} />
      </Helmet>

      <div className="row">
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src={product.imagen || 'https://placehold.co/600x400/e0e0e0/ffffff?text=No+Image'}
            alt={product.nombre}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '500px', objectFit: 'contain', width: '100%' }}
            aria-label={`Imagen del producto ${product.nombre}`}
          />
        </div>
        <div className="col-md-6">
          <h1 id="product-detail-heading" className="display-5 fw-bold text-primary mb-3">
            {product.nombre}
          </h1>
          <p className="text-muted mb-2">Categoría: <span aria-label={`Categoría: ${product.categoria}`}>{product.categoria}</span></p>
          <p className="lead text-secondary mb-4">{product.descripcion}</p>
          <p className="fs-3 fw-bolder text-success mb-4" aria-label={`Precio: ${Number(product.precio).toFixed(2)} dólares`}>
            ${Number(product.precio).toFixed(2)}
          </p>

          <div className="d-grid gap-2">
            <button
              className="btn btn-warning btn-lg d-flex align-items-center justify-content-center"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              aria-label={`Añadir ${product.nombre} al carrito`}
            >
              {isAddingToCart ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Añadiendo...
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus-fill me-2"></i> Añadir al Carrito
                </>
              )}
            </button>
            <Link to="/productos" className="btn btn-outline-secondary btn-lg" aria-label="Volver a la lista de productos">
              Volver a Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;