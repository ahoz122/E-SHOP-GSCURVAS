import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { mockProducts } from '../data/mockProducts';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-pink-100 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Moldea tu figura
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Descubre nuestra colección de fajas y cinturillas de alta calidad
          </p>
          <button className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors">
            Ver Colección
          </button>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-pink-500 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En compras mayores a $50</p>
            </div>
            <div className="p-6">
              <div className="text-pink-500 text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Materiales de primera calidad</p>
            </div>
            <div className="p-6">
              <div className="text-pink-500 text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Pago Seguro</h3>
              <p className="text-gray-600">Múltiples métodos de pago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 