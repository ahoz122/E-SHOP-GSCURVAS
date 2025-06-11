import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2, FiSend, FiCreditCard } from 'react-icons/fi';
import { useCartStore } from '../../stores/cartStore';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

// URL de pruebas de Stripe Checkout
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/test_5kQcN7b4b9hG9YbcYr2B200';

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, clearCart, sendToWhatsApp } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleStripePayment = () => {
    setIsProcessing(true);
    try {
      // Redirigir directamente a la URL de pruebas de Stripe
      window.location.href = STRIPE_CHECKOUT_URL;
    } catch (error) {
      console.error('Error al redirigir:', error);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Carrito de Compras</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                Tu carrito está vacío
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow"
                  >
                    <img
                      src={item.images.main}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Talla: {item.selectedSize} | Color: {item.selectedColor}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 mt-2"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => {
                    sendToWhatsApp();
                    onClose();
                  }}
                  disabled={items.length === 0}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiSend size={18} />
                  Enviar por WhatsApp
                </button>
              </div>
              <button
                onClick={handleStripePayment}
                disabled={items.length === 0 || isProcessing}
                className="w-full px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCreditCard size={18} />
                {isProcessing ? 'Procesando...' : 'Pagar con tarjeta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart; 