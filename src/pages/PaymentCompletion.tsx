import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';

const PaymentCompletion: React.FC = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'error' | 'processing'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Obtener el ID del pago de la URL
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (clientSecret) {
      stripe
        .retrievePaymentIntent(clientSecret)
        .then(({ paymentIntent }) => {
          switch (paymentIntent?.status) {
            case 'succeeded':
              setStatus('success');
              setMessage('¡Pago completado con éxito!');
              break;
            case 'processing':
              setStatus('processing');
              setMessage('Tu pago está siendo procesado.');
              break;
            case 'requires_payment_method':
              setStatus('error');
              setMessage('Tu pago no fue exitoso, por favor intenta de nuevo.');
              break;
            default:
              setStatus('error');
              setMessage('Algo salió mal.');
              break;
          }
        });
    }
  }, [stripe]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          {status === 'success' && (
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FiX className="w-8 h-8 text-red-500" />
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4 text-gray-800">{message}</h2>

          {status === 'success' && (
            <p className="text-gray-600 mb-8">
              Gracias por tu compra. Te enviaremos un correo con los detalles de tu pedido.
            </p>
          )}

          {status === 'error' && (
            <p className="text-gray-600 mb-8">
              Hubo un problema al procesar tu pago. Por favor, intenta de nuevo o contacta con soporte.
            </p>
          )}

          {status === 'processing' && (
            <p className="text-gray-600 mb-8">
              Por favor, espera mientras confirmamos tu pago...
            </p>
          )}

          <div className="space-y-4">
            {status === 'success' && (
              <Link
                to="/"
                className="block w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                Volver al inicio
              </Link>
            )}

            {status === 'error' && (
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            )}

            {status !== 'processing' && (
              <Link
                to="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
              >
                Volver al inicio
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCompletion; 