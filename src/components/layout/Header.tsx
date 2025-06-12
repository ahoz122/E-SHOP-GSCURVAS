import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiMaximize2, FiVideo, FiShoppingBag, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import Cart from '../cart/Cart';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

const Header: React.FC = () => {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const items = useCartStore(state => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuthStore();
  const authMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: 'Inicio', icon: <FiHome /> },
    { path: '/medidas', label: 'Medidas', icon: <FiMaximize2 /> },
    { path: '/asesoria', label: 'Asesoría', icon: <FiVideo /> },
    { path: '/catalogo', label: 'Catálogo', icon: <FiShoppingBag /> },
  ];

  const handleAuthClick = () => {
    setIsAuthMenuOpen(!isAuthMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthMenuOpen(false);
  };

  useEffect(() => {
    if (!isAuthMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setIsAuthMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAuthMenuOpen]);

  return (
    <header className="bg-white shadow-sm w-full border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <nav className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 shadow-lg mr-2">
              <span className="text-white text-2xl font-black font-playfair">GS</span>
            </div>
            <span className="text-4xl font-black font-playfair tracking-wide text-pink-600 drop-shadow-sm select-none">GSCURVAS</span>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-playfair text-xl tracking-wide
                  ${location.pathname === item.path
                    ? 'text-pink-600 font-black'
                    : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-semibold'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-pink-50 rounded-lg -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  aria-label="Carrito de compras"
                >
                  <FiShoppingCart size={20} />
                </button>
                
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                    >
                      <motion.span
                        key={totalItems}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {totalItems}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={authMenuRef}>
                <button
                  onClick={handleAuthClick}
                  className="p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  aria-label="Menú de usuario"
                >
                  <FiUser size={20} />
                </button>

                <AnimatePresence>
                  {isAuthMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl border border-gray-100 z-[120]"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                            {user.email}
                          </div>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                            onClick={() => setIsAuthMenuOpen(false)}
                          >
                            Mi Perfil
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-2"
                          >
                            <FiLogOut size={16} />
                            Cerrar Sesión
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                            onClick={() => setIsAuthMenuOpen(false)}
                          >
                            Iniciar Sesión
                          </Link>
                          <Link
                            to="/register"
                            className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                            onClick={() => setIsAuthMenuOpen(false)}
                          >
                            Registrarse
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </nav>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header; 