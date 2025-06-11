import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiMaximize2, FiVideo, FiShoppingBag, FiShoppingCart } from 'react-icons/fi';
import Cart from '../cart/Cart';
import { useCartStore } from '../../stores/cartStore';

const Header: React.FC = () => {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore(state => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { path: '/', label: 'Inicio', icon: <FiHome /> },
    { path: '/medidas', label: 'Medidas', icon: <FiMaximize2 /> },
    { path: '/asesoria', label: 'Asesoría', icon: <FiVideo /> },
    { path: '/catalogo', label: 'Catálogo', icon: <FiShoppingBag /> },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-pink-600">
            Luxphes
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                  ${location.pathname === item.path
                    ? 'text-pink-600'
                    : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
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
            
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="ml-2 p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
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
          </div>
        </nav>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header; 