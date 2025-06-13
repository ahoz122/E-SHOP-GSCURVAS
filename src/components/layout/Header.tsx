import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiMaximize2, FiVideo, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import { ShoppingCart, UserRound, Menu, X } from 'lucide-react';
import Cart from '../cart/Cart';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

const Header: React.FC = () => {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div className="w-full md:max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        <nav className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg mr-1 sm:mr-2 overflow-hidden">
              <img src="/assets/logo.jpeg" alt="Logo GSCURVAS" className="object-contain w-full h-full" />
            </div>
            <span className="truncate text-xl sm:text-2xl md:text-4xl font-black font-playfair tracking-wide text-black drop-shadow-sm select-none">GSCURVAS</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-playfair text-xl tracking-wide
                  ${location.pathname === item.path
                    ? 'text-black font-black'
                    : 'text-black hover:text-gray-700 hover:bg-gray-100 font-semibold'
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
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-lg text-black hover:text-gray-700 hover:bg-gray-100 transition-colors shadow"
                aria-label="Carrito de compras"
              >
                <ShoppingCart size={28} strokeWidth={2.2} />
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

            <div className="relative hidden md:block">
              <button
                onClick={handleAuthClick}
                className="p-2 rounded-lg text-black hover:text-gray-700 hover:bg-gray-100 transition-colors shadow"
                aria-label="Menú de usuario"
              >
                <UserRound size={28} strokeWidth={2.2} />
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

            <button
              className="md:hidden ml-2 p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={32} />
            </button>
          </div>
        </nav>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[200] flex"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative bg-white w-72 max-w-full h-full shadow-2xl p-6 flex flex-col gap-6">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 text-3xl"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={32} />
              </button>
              <div className="flex items-center gap-3 mb-8 mt-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 shadow-lg">
                  <span className="text-white text-xl font-black font-playfair">GS</span>
                </div>
                <span className="text-2xl font-black font-playfair tracking-wide text-pink-600 select-none">GSCURVAS</span>
              </div>
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-playfair text-lg tracking-wide transition-colors
                      ${location.pathname === item.path
                        ? 'text-pink-600 font-black bg-pink-50'
                        : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-semibold'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header; 