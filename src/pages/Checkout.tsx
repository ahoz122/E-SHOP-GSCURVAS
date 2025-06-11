import React, { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../config/stripe';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { useShopStore } from '../stores/shopStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Checkout: React.FC = () => {
  const { cart } = useShopStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout; 