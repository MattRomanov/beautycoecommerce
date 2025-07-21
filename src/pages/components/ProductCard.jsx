import React from "react";
import { useCart } from "../../../contexts/CartContext";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductCard = ({ product, onDelete, onEdit, isAdmin }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    console.log(`Producto "${product.nombre}" añadido al carrito.`);
    toast.success(`¡${product.nombre} añadido al carrito!`, {
      toastId: `add-to-cart-${product.id}`
    });
  };

  const placeholderImage = "https://placehold.co/400x300/e0e0e0/ffffff?text=No+Image";

  return (
    <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden d-flex flex-column transform-on-hover">
      <Link to={`/productos/${product.id}`} className="d-block product-image-container">
        <div className="w-100 overflow-hidden" style={{ height: '200px' }}>
          <img
            src={product.imagen || placeholderImage}
            className="img-fluid w-100 h-100 object-fit-cover product-image rounded-top"
            alt={product.nombre}
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
          />
        </div>
      </Link>
      <div className="card-body d-flex flex-column flex-grow-1 p-3">
        <h5 className="card-title text-primary fw-bold fs-5 mb-2">
          <Link to={`/productos/${product.id}`} className="text-decoration-none text-inherit">
            {product.nombre}
          </Link>
        </h5>
        <p className="card-text text-muted small mb-2 flex-grow-1 text-truncate-lines-3">{product.descripcion}</p>
        <p className="card-text text-secondary small mb-2">Categoría: {product.categoria}</p>
        <p className="card-text text-success fw-bolder fs-4 mb-3 mt-auto">
          ${Number(product.precio).toFixed(2)}
        </p>

        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-warning btn-sm d-flex align-items-center"
            onClick={handleAddToCart}
          >
            <i className="fas fa-cart-plus me-1"></i> Añadir al Carrito
          </button>

          {isAdmin && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-info btn-sm d-flex align-items-center"
                onClick={() => onEdit(product)}
              >
                <i className="fas fa-pencil-alt me-1"></i> Editar
              </button>
              <button
                className="btn btn-danger btn-sm d-flex align-items-center"
                onClick={() => onDelete(product.id, product.nombre)}
              >
                <i className="fas fa-trash-alt me-1"></i> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;