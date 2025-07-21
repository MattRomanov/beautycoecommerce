import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const Checkout = () => {
  const { cart, clearCart, getQuantity } = useCart();
  const navigate = useNavigate();
  const paymentMethodsImageUrl = '/pagos.jpg';

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: '',
    metodoPago: 'tarjeta',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const itemPrice = Number(item.precio) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      return acc + (itemPrice * itemQuantity);
    }, 0);
  };

  useEffect(() => {
    if (getQuantity() === 0 && !isPurchaseCompleted) {
      toast.info('Tu carrito está vacío. Añade productos antes de proceder al pago.', {
        toastId: 'empty-cart-checkout',
        autoClose: 3000
      });
      navigate('/productos');
    }
  }, [cart, navigate, isPurchaseCompleted, getQuantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreCompleto.trim()) newErrors.nombreCompleto = 'Nombre completo requerido';
    if (!formData.email.trim()) newErrors.email = 'Email requerido';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.direccion.trim()) newErrors.direccion = 'Dirección requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'Ciudad requerida';
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = 'Código postal requerido';
    if (!formData.pais.trim()) newErrors.pais = 'País requerido';

    if (formData.metodoPago === 'tarjeta') {
      if (!formData.numeroTarjeta.trim()) newErrors.numeroTarjeta = 'Número de tarjeta requerido';
      else if (!/^\d{16}$/.test(formData.numeroTarjeta)) newErrors.numeroTarjeta = '16 dígitos requeridos';
      if (!formData.fechaExpiracion.trim()) newErrors.fechaExpiracion = 'Fecha requerida';
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.fechaExpiracion)) newErrors.fechaExpiracion = 'Formato MM/AA';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV requerido';
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = '3-4 dígitos requeridos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario', {
        toastId: 'checkout-errors',
        autoClose: 4000
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`¡Compra exitosa por $${calculateTotal().toFixed(2)}!`, {
        toastId: 'purchase-success',
        autoClose: 5000
      });

      clearCart();
      setIsPurchaseCompleted(true);
      navigate('/productos');
    } catch (error) {
      toast.error('Error al procesar el pago', {
        toastId: 'purchase-error',
        autoClose: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (getQuantity() === 0 && !isPurchaseCompleted) {
    return null;
  }

  return (
    <div className="container my-4">
      <Helmet>
        <title>Finalizar Compra | Mi Tienda</title>
        <meta name="description" content="Complete su información de pago y envío" />
      </Helmet>

      <h2 className="mb-4 text-center">Finalizar Compra</h2>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card p-4 shadow-sm mb-4">
            <h4 className="mb-3">Información de Envío</h4>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="nombreCompleto" className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className={`form-control ${errors.nombreCompleto ? 'is-invalid' : ''}`}
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                />
                {errors.nombreCompleto && <div className="invalid-feedback">{errors.nombreCompleto}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">Dirección</label>
                <input
                  type="text"
                  className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
                {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="ciudad" className="form-label">Ciudad</label>
                  <input
                    type="text"
                    className={`form-control ${errors.ciudad ? 'is-invalid' : ''}`}
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                  />
                  {errors.ciudad && <div className="invalid-feedback">{errors.ciudad}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
                  <input
                    type="text"
                    className={`form-control ${errors.codigoPostal ? 'is-invalid' : ''}`}
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                  />
                  {errors.codigoPostal && <div className="invalid-feedback">{errors.codigoPostal}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="pais" className="form-label">País</label>
                <input
                  type="text"
                  className={`form-control ${errors.pais ? 'is-invalid' : ''}`}
                  id="pais"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  required
                />
                {errors.pais && <div className="invalid-feedback">{errors.pais}</div>}
              </div>

              <h4 className="mb-3 mt-4">Método de Pago</h4>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="metodoPago"
                    id="metodoPagoTarjeta"
                    value="tarjeta"
                    checked={formData.metodoPago === 'tarjeta'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="metodoPagoTarjeta">
                    Tarjeta de Crédito/Débito
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="metodoPago"
                    id="metodoPagoPaypal"
                    value="paypal"
                    checked={formData.metodoPago === 'paypal'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="metodoPagoPaypal">
                    PayPal
                  </label>
                </div>
              </div>

              {formData.metodoPago === 'tarjeta' && (
                <>
                  <div className="mb-3">
                    <label htmlFor="numeroTarjeta" className="form-label">Número de Tarjeta</label>
                    <input
                      type="text"
                      className={`form-control ${errors.numeroTarjeta ? 'is-invalid' : ''}`}
                      id="numeroTarjeta"
                      name="numeroTarjeta"
                      value={formData.numeroTarjeta}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    {errors.numeroTarjeta && <div className="invalid-feedback">{errors.numeroTarjeta}</div>}
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fechaExpiracion" className="form-label">Fecha de Expiración</label>
                      <input
                        type="text"
                        className={`form-control ${errors.fechaExpiracion ? 'is-invalid' : ''}`}
                        id="fechaExpiracion"
                        name="fechaExpiracion"
                        value={formData.fechaExpiracion}
                        onChange={handleChange}
                        placeholder="MM/AA"
                        required
                      />
                      {errors.fechaExpiracion && <div className="invalid-feedback">{errors.fechaExpiracion}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cvv" className="form-label">CVV</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        required
                      />
                      {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Procesando...
                  </>
                ) : 'Confirmar Compra'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Resumen del Pedido</h4>
            <ul className="list-group mb-3">
              {cart.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{item.nombre}</h6>
                    <small className="text-muted">Cantidad: {item.quantity}</small>
                  </div>
                  <span className="text-muted">${(item.precio * item.quantity).toFixed(2)}</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>${calculateTotal().toFixed(2)}</strong>
              </li>
            </ul>

            <div className="text-center mt-3">
              <img
                src={paymentMethodsImageUrl}
                alt="Métodos de pago aceptados"
                className="img-fluid rounded"
                style={{ maxWidth: '350px', height: 'auto' }}
              />
              <p className="text-muted mt-2 small">Pagos 100% seguros</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;