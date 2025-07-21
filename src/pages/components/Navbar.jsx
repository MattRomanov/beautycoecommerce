import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useCart } from "../../contexts/CartContext";

import { useAuth } from "../../contexts/AuthContext";

import { FaShoppingCart, FaHome, FaBoxOpen, FaSearch, FaUser, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaCog } from 'react-icons/fa';

import { toast } from 'react-toastify';



const Navbar = () => {

  const { cart, getQuantity } = useCart();

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');



  const handleCartClick = () => {

    if (cart.length === 0) {

      toast.info('Tu carrito está vacío', { toastId: 'cart-empty-navbar' });

    }

  };



  const handleLogout = () => {

    logout();

    toast.info('Sesión cerrada correctamente.', { toastId: 'logout-success' });

    navigate('/');

  };



  const handleSearch = (e) => {

    e.preventDefault();

    if (searchTerm.trim()) {

      navigate(`/productos?search=${searchTerm.trim()}`);

    } else {

      navigate('/productos');

    }

  };



  return (

    <nav

      className="navbar navbar-expand-lg navbar-light bg-light py-3 shadow-sm"

      aria-label="Barra de navegación principal"

    >

      <div className="container-fluid">

        <Link

          className="navbar-brand d-flex align-items-center text-primary fw-bold fs-5"

          to="/"

          aria-label="Ir a la página de inicio"

        >

          <i className="fas fa-store me-2"></i> Beauty&Co

        </Link>



        <button

          className="navbar-toggler"

          type="button"

          data-bs-toggle="collapse"

          data-bs-target="#navbarContent"

          aria-controls="navbarContent"

          aria-expanded="false"

          aria-label="Alternar navegación"

        >

          <span className="navbar-toggler-icon"></span>

        </button>



        <div className="collapse navbar-collapse" id="navbarContent">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">

              <Link

                className="nav-link d-flex align-items-center text-dark fw-medium px-3 py-2"

                to="/"

                aria-current="page"

                aria-label="Ir a Inicio"

              >

                <FaHome className="me-1" /> Inicio

              </Link>

            </li>

            <li className="nav-item">

              <Link

                className="nav-link d-flex align-items-center text-dark fw-medium px-3 py-2"

                to="/productos"

                aria-label="Ir a Productos"

              >

                <FaBoxOpen className="me-1" /> Productos

              </Link>

            </li>

            {user.isLoggedIn && user.isAdmin && (

              <li className="nav-item">

                <Link

                  className="nav-link d-flex align-items-center text-dark fw-medium px-3 py-2"

                  to="/admin"

                  aria-label="Ir al Panel de Administración"

                >

                  <FaCog className="me-1" /> Panel Admin

                </Link>

              </li>

            )}

          </ul>



          <form className="d-flex me-3 my-2 my-lg-0" role="search" onSubmit={handleSearch} aria-label="Formulario de búsqueda de productos">

            <div className="input-group">

              <input

                className="form-control search-input rounded-start-pill border-primary"

                type="search"

                placeholder="Buscar productos..."

                aria-label="Buscar productos por nombre o categoría"

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

                style={{ width: '200px' }}

              />

              <button className="btn btn-primary search-button rounded-end-pill" type="submit" aria-label="Realizar búsqueda">

                <FaSearch />

              </button>

            </div>

          </form>



          <div className="d-flex align-items-center">

            {!user.isLoggedIn ? (

              <>

                <Link

                  className="btn btn-outline-primary rounded-pill me-2 d-flex align-items-center fw-medium px-3 py-2"

                  to="/login"

                  aria-label="Ir a Iniciar Sesión"

                >

                  <FaSignInAlt className="me-1" /> Iniciar Sesión

                </Link>

                <Link

                  className="btn btn-primary rounded-pill me-2 d-flex align-items-center fw-medium px-3 py-2"

                  to="/register"

                  aria-label="Ir a Registrarse"

                >

                  <FaUserPlus className="me-1" /> Registrarse

                </Link>

              </>

            ) : (

              <>

                <span className="me-2 text-dark fw-medium" aria-label={`Usuario actual: ${user.isAdmin ? 'Administrador' : 'Cliente'}`}>Hola, {user.isAdmin ? 'Admin' : 'Cliente'}</span>

                <button

                  className="btn btn-outline-danger rounded-pill d-flex align-items-center fw-medium px-3 py-2"

                  onClick={handleLogout}

                  aria-label="Cerrar sesión"

                >

                  <FaSignOutAlt className="me-1" /> Cerrar Sesión

                </button>

              </>

            )}



            <Link

              className="btn position-relative d-flex align-items-center ms-3 bg-primary text-white rounded-pill fw-medium px-3 py-2"

              to="/carrito"

              onClick={handleCartClick}

              aria-label={`Ver carrito de compras con ${getQuantity()} productos`}

            >

              <FaShoppingCart className="me-1" />

              Carrito

              {getQuantity() > 0 && (

                <span

                  className="cart-counter position-absolute top-0 start-100 translate-middle"

                  aria-label={`Número de productos en el carrito: ${getQuantity()}`}

                >

                  {getQuantity()}

                </span>

              )}

            </Link>

          </div>

        </div>

      </div>

    </nav>

  );

};



export default Navbar;