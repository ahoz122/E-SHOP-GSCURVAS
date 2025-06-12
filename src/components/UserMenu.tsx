import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { FiUser, FiLogOut, FiSettings, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';

const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Foto de perfil"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
            <FiUser className="text-pink-600" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {user.displayName || 'Usuario'}
        </span>
      </motion.button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header="Mi Cuenta"
        modalConfig={{
          width: "40%",
          bodyPadding: "lg",
          bodyAlignment: "left",
        }}
      >
        <div className="space-y-6">
          {/* Perfil del usuario */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Foto de perfil"
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                <FiUser className="text-pink-600 text-2xl" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user.displayName || 'Usuario'}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/orders');
              }}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <FiShoppingBag className="mr-3 text-pink-600" />
              <span>Mis Pedidos</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <FiSettings className="mr-3 text-pink-600" />
              <span>Configuración</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="mr-3" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserMenu; 