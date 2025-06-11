import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useShopStore } from '../../stores/shopStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { cart, clearCart } = useShopStore();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Aquí normalmente crearías un PaymentIntent en tu backend
      // Por ahora, simularemos que tenemos un clientSecret
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/completion`,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Hubo un error al procesar el pago.');
      } else {
        clearCart();
        navigate('/completion');
      }
    } catch (error) {
      setError('Hubo un error inesperado. Por favor, intenta de nuevo.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Información de Pago</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalles de la Tarjeta
            </label>
            <div className="border border-gray-300 rounded-md p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Resumen del Pedido</h3>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-bold">
              <p>Total</p>
              <p>${calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-md text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-pink-600 text-white py-3 rounded-lg font-medium
          ${(!stripe || processing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-700'}`}
        whileHover={{ scale: !processing && stripe ? 1.01 : 1 }}
        whileTap={{ scale: !processing && stripe ? 0.99 : 1 }}
      >
        {processing ? 'Procesando...' : 'Pagar Ahora'}
      </motion.button>
    </form>
  );
};

export default CheckoutForm; 