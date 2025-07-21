import React from 'react';
import { useCart } from '../contexts/CartContext';
import { FaTrash, FaShoppingBag, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const Cart = () => {
  const { cart, removeItem, clearCart, updateQuantity, getQuantity } = useCart();
  const navigate = useNavigate();

  const handleRemoveItem = (productId, productName) => {
    removeItem(productId);
    toast.error(`¡${productName} eliminado!`, {
      toastId: `remove-${productId}`,
      position: 'top-center',
      autoClose: 2000,
      style: { top: '50%', transform: 'translateY(-50%)' }
    });
  };

  const handleIncreaseQuantity = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
    toast.info('Cantidad actualizada', {
      toastId: `update-${productId}-inc`,
      position: 'top-center',
      autoClose: 1500,
      style: { top: '50%', transform: 'translateY(-50%)' }
    });
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
      toast.info('Cantidad actualizada', {
        toastId: `update-${productId}-dec`,
        position: 'top-center',
        autoClose: 1500,
        style: { top: '50%', transform: 'translateY(-50%)' }
      });
    } else {
      const product = cart.find(item => item.id === productId);
      handleRemoveItem(productId, product?.nombre);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('¡Carrito vaciado con éxito!', {
      toastId: 'cart-cleared',
      position: 'top-center',
      autoClose: 2000,
      style: { top: '50%', transform: 'translateY(-50%)' }
    });
    navigate('/productos');
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const itemPrice = Number(item.precio) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      return acc + (itemPrice * itemQuantity);
    }, 0);
  };

  if (getQuantity() === 0) {
    return (
      <div className="container my-4">
        <Helmet>
          <title>Mi Tienda Online - Carrito Vacío</title>
          <meta name="description" content="Tu carrito de compras está vacío" />
        </Helmet>
        
        <div className="alert alert-info text-center" role="status" aria-live="polite">
          <h5>Tu carrito está vacío</h5>
          <p className="mb-3">¡Explora nuestros productos!</p>
          <Link to="/productos" className="btn btn-primary">
            <FaArrowLeft className="me-2" /> Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <Helmet>
        <title>Mi Tienda Online - Carrito</title>
        <meta name="description" content="Revisa los productos en tu carrito de compras" />
      </Helmet>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/productos" className="btn btn-outline-primary">
          <FaArrowLeft className="me-2" /> Seguir Comprando
        </Link>
        <h2 className="mb-0">
          <FaShoppingBag className="me-2" /> Tu Carrito
        </h2>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col" className="text-center">Cantidad</th>
              <th scope="col" className="text-end">Precio</th>
              <th scope="col" className="text-end">Subtotal</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <th scope="row">
                  <div className="d-flex align-items-center">
                    <img
                      src={item.imagen || 'https://placehold.co/60x60/e0e0e0/ffffff?text=No+Image'}
                      alt={item.nombre}
                      className="img-thumbnail me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                    />
                    <span>{item.nombre}</span>
                  </div>
                </th>
                <td className="text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </td>
                <td className="text-end">${Number(item.precio).toFixed(2)}</td>
                <td className="text-end">${(Number(item.precio) * Number(item.quantity)).toFixed(2)}</td>
                <td className="text-end">
                  <button
                    onClick={() => handleRemoveItem(item.id, item.nombre)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total:</td>
              <td className="text-end fw-bold">${calculateTotal().toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button
          onClick={handleClearCart}
          className="btn btn-outline-danger"
        >
          Vaciar Carrito
        </button>
        <Link to="/checkout" className="btn btn-primary">
          Proceder al Pago
        </Link>
      </div>
    </div>
  );
};

export default Cart;