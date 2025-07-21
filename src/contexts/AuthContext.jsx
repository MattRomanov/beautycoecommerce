import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : { isLoggedIn: false, isAdmin: false };
    } catch (error) {
      console.error("Error al cargar el usuario de localStorage:", error);
      toast.error('Error al cargar sesión guardada', {
        toastId: 'auth-load-error',
        autoClose: 3000
      });
      return { isLoggedIn: false, isAdmin: false };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error("Error al guardar el usuario en localStorage:", error);
      toast.error('Error al guardar sesión', {
        toastId: 'auth-save-error',
        autoClose: 3000
      });
    }
  }, [user]);

  const login = (username, password) => {
    try {
      if (username === 'admin' && password === 'admin123') {
        setUser({ isLoggedIn: true, isAdmin: true });
        toast.success('Bienvenido Administrador', {
          toastId: 'admin-login-success',
          autoClose: 3000
        });
        return true;
      } else if (username === 'cliente' && password === 'cliente123') {
        setUser({ isLoggedIn: true, isAdmin: false });
        toast.success('Bienvenido Cliente', {
          toastId: 'client-login-success',
          autoClose: 3000
        });
        return true;
      }
      
      toast.error('Credenciales incorrectas', {
        toastId: 'login-error',
        autoClose: 4000
      });
      return false;
      
    } catch (error) {
      toast.error('Error en el proceso de login', {
        toastId: 'login-exception',
        autoClose: 4000
      });
      return false;
    }
  };

  const register = (username, password) => {
    try {
      // Lógica de registro simulada
      toast.success('Registro exitoso. Por favor inicie sesión', {
        toastId: `register-success-${username}`,
        autoClose: 4000
      });
      return true;
    } catch (error) {
      toast.error('Error en el registro', {
        toastId: 'register-error',
        autoClose: 4000
      });
      return false;
    }
  };

  const logout = () => {
    setUser({ isLoggedIn: false, isAdmin: false });
    toast.info('Sesión cerrada correctamente', {
      toastId: 'logout-success',
      autoClose: 2500
    });
  };

  const contextValue = {
    user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};