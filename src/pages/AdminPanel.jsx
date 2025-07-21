import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProducts, deleteProduct } from '../services/api';
import ProductForm from './components/products/ProductForm';
import ProductList from './components/products/ProductList';
import ConfirmationModal from './components/ConfirmationModal';
import { Helmet } from 'react-helmet';

import { toast } from 'react-toastify';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [productNameToDelete, setProductNameToDelete] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user.isLoggedIn || !user.isAdmin) {
      toast.error('Acceso denegado. Solo administradores.', { toastId: 'admin-access-denied' });
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [user, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
      console.log("Productos cargados en Admin Panel:", data);
    } catch (err) {
      console.error("Error al cargar los productos en Admin Panel:", err);
      setError('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
      toast.error('Error al cargar productos para el panel de administración.', { toastId: 'admin-load-products-error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (productId, productName) => {
    setProductIdToDelete(productId);
    setProductNameToDelete(productName);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      await deleteProduct(productIdToDelete);
      toast.success(`Producto "${productNameToDelete}" eliminado con éxito!`, { toastId: `delete-success-${productIdToDelete}` });
      fetchProducts();
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      toast.error('Error al eliminar el producto.', { toastId: `delete-error-${productIdToDelete}` });
    } finally {
      setProductIdToDelete(null);
      setProductNameToDelete('');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setProductIdToDelete(null);
    setProductNameToDelete('');
    toast.info('Eliminación cancelada.', { toastId: 'delete-cancelled' });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setEditingProduct(null);
    setShowForm(false);
    fetchProducts();
  };

  if (!user.isLoggedIn || !user.isAdmin) {
    return null;
  }

  return (
    <div className="admin-panel-page container my-4">
      <Helmet>
        <title>Mi Tienda Online - Panel de Administración</title>
        <meta name="description" content="Gestiona los productos de tu tienda online: añade, edita y elimina productos." />
      </Helmet>

      <h1 className="mb-4 text-center">Panel de Administración</h1>

      <button
        className="btn btn-success mb-4 d-block mx-auto"
        onClick={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}
      >
        Añadir Nuevo Producto
      </button>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
        />
      )}

      <h2 className="mb-4 mt-5 text-center">Gestión de Productos Existentes</h2>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando productos...</span>
          </div>
          <p className="mt-2">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center my-5" role="alert">
          {error}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted">No hay productos para gestionar.</p>
      ) : (
        <ProductList
          products={products}
          isAdminView={true}
          onDeleteProduct={handleDeleteClick}
          onEditProduct={handleEdit}
        />
      )}

      <ConfirmationModal
        show={showConfirmModal}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar "${productNameToDelete}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AdminPanel;