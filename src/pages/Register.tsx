import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FirebaseError } from 'firebase/app';

const Register = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, error: storeError, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (error: FirebaseError) => {
    switch (error.code) {
      case 'auth/operation-not-allowed':
        return 'El registro con Google no está habilitado. Por favor, contacta al administrador.';
      case 'auth/popup-closed-by-user':
        return 'Se cerró la ventana de registro. Por favor, intenta de nuevo.';
      case 'auth/cancelled-popup-request':
        return 'Se canceló la operación. Por favor, intenta de nuevo.';
      case 'auth/popup-blocked':
        return 'El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes e intenta de nuevo.';
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado. Por favor, inicia sesión o usa otro correo.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
      default:
        return 'Ocurrió un error durante el registro. Por favor, intenta de nuevo.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getErrorMessage(err));
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getErrorMessage(err));
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4 fixed inset-0 z-[100]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            <FiArrowLeft size={24} />
          </motion.button>
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center text-gray-800"
          >
            Crear Cuenta
          </motion.h2>
          <div className="w-6" /> {/* Espaciador para centrar el título */}
        </div>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiUser />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="María García"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiMail />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>
          </div>

          {(error || storeError) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-2 text-center"
            >
              {error || storeError}
            </motion.p>
          )}

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              'Registrarse'
            )}
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all ${
              isGoogleLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isGoogleLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full"
              />
            ) : (
              <>
                <FcGoogle className="w-5 h-5 mr-2" />
                Continuar con Google
              </>
            )}
          </motion.button>

          <motion.p
            variants={itemVariants}
            className="text-sm text-center text-gray-600"
          >
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-pink-600 hover:text-pink-500 transition-colors"
            >
              Inicia sesión
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register; 