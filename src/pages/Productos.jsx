import React, { useEffect, useState } from 'react';
import ProductList from "./components/products/ProductList";
import { getProducts } from "../services/api";
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error al cargar los productos en Productos.jsx:", err);
      setError('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
      toast.error('Error al cargar productos.', { toastId: 'load-products-error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search');

    let currentFiltered = products;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = products.filter(product =>
        product.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.descripcion.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.categoria.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    setFilteredProducts(currentFiltered);
    setCurrentPage(1);
  }, [products, location.search]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container py-4">
      <Helmet>
        <title>Mi Tienda Online - Productos</title>
        <meta name="description" content="Explora nuestro catálogo completo de productos en Mi Tienda Online. Encuentra lo que necesitas." />
      </Helmet>

      <h2 className="text-center mb-4">Explora Nuestros Productos</h2>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando productos...</span>
          </div>
          <p className="mt-2 text-secondary">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center my-5" role="alert">
          {error}
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-muted">
          {location.search ? 'No se encontraron productos que coincidan con tu búsqueda.' : 'No hay productos disponibles en este momento.'}
        </p>
      ) : (
        <>
          <ProductList products={currentProducts} key={currentPage} />

          {totalPages > 1 && (
            <nav aria-label="Paginación de productos" className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous"
                  >
                    Anterior
                  </button>
                </li>
                {pageNumbers.map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(number)}
                      aria-current={currentPage === number ? 'page' : undefined}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next"
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Productos;