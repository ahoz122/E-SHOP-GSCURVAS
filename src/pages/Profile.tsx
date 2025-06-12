import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiEdit2, FiX } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import Lottie from 'lottie-react';
import particlesAnimation from '../assets/lottie/particles.json';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || '');
  const [editPhoto, setEditPhoto] = useState(user?.photoURL || '');

  const handleEdit = () => {
    setEditName(user?.displayName || '');
    setEditPhoto(user?.photoURL || '');
    setIsEditOpen(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-pink-50 py-10 px-2 overflow-hidden">
      {/* Fondo animado Lottie */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Lottie animationData={particlesAnimation} loop autoPlay style={{ width: '100%', height: '100%' }} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="w-full max-w-2xl bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl pt-32 pb-12 px-8 flex flex-col items-center relative border border-white/40"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
      >
        {/* Foto de usuario flotando */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2">
          {user?.photoURL ? (
            <motion.img
              src={user.photoURL}
              alt="Foto de perfil"
              className="w-48 h-48 rounded-full object-cover border-4 border-pink-200 shadow-xl bg-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
            />
          ) : (
            <motion.div
              className="w-48 h-48 rounded-full bg-pink-100 flex items-center justify-center border-4 border-pink-200 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              <FiUser className="text-pink-400 text-8xl" />
            </motion.div>
          )}
          <button
            className="absolute bottom-6 right-6 bg-white/90 hover:bg-pink-100 text-pink-600 p-4 rounded-full shadow transition-colors border border-pink-200"
            title="Editar foto"
            onClick={handleEdit}
          >
            <FiEdit2 />
          </button>
        </div>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2 text-center mt-8 drop-shadow-lg">
          {user?.displayName || 'Usuario'}
        </h2>
        <p className="text-lg text-gray-500 text-center mb-8 drop-shadow">
          {user?.email}
        </p>
        <button
          className="btn-primary w-full max-w-xs mt-2 flex items-center justify-center gap-2 text-lg py-3 shadow-lg hover:scale-105 transition-transform"
          onClick={handleEdit}
        >
          <FiEdit2 />
          Editar perfil
        </button>

        {/* Modal de edición */}
        {isEditOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 text-2xl"
                onClick={() => setIsEditOpen(false)}
                title="Cerrar"
              >
                <FiX />
              </button>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Editar perfil</h3>
              <form className="flex flex-col items-center gap-6">
                <div className="relative">
                  {editPhoto ? (
                    <img
                      src={editPhoto}
                      alt="Foto de perfil"
                      className="w-32 h-32 rounded-full object-cover border-4 border-pink-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-pink-100 flex items-center justify-center border-4 border-pink-200 shadow-lg">
                      <FiUser className="text-pink-400 text-5xl" />
                    </div>
                  )}
                  {/* Aquí podrías agregar input para subir nueva foto */}
                </div>
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                </div>
                {/* Botón para guardar cambios (no implementa lógica de guardado real) */}
                <button
                  type="button"
                  className="btn-primary w-full max-w-xs mt-2 flex items-center justify-center gap-2 text-lg py-3"
                  onClick={() => setIsEditOpen(false)}
                >
                  Guardar cambios
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile; 