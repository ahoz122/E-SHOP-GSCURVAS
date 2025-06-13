import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { mockProducts } from '../data/mockProducts';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const slides = [
  {
    title: "Moldea tu figura",
    subtitle: "Descubre nuestra colección de fajas y cinturillas de alta calidad",
    image: "/assets/hero1.jpg",
  },
  {
    title: "Confort y Estilo",
    subtitle: "Diseños ergonómicos que se adaptan a tu cuerpo",
    image: "/assets/hero2.jpg",
  },
  {
    title: "Resultados Visibles",
    subtitle: "Transforma tu silueta con nuestras prendas modeladoras",
    image: "/assets/hero3.jpg",
  }
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full px-2 sm:px-4 py-4 sm:py-6 relative z-0 bg-transparent">
        <div className="relative h-[65vh] md:h-[75vh] overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-gray-900 to-gray-800 transform hover:shadow-2xl transition-all duration-300">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 rounded-3xl overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl transform hover:scale-105 transition-transform duration-3000"
                style={{ 
                  backgroundImage: `url(${slides[currentSlide].image})`,
                  filter: 'brightness(0.7) blur(1.5px)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-gray-900/70 to-transparent rounded-3xl backdrop-blur-[2.5px]" />
              
              <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl drop-shadow"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/90 backdrop-blur-sm text-gray-900 px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl transform"
                >
                  Ver Colección
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-between px-6 sm:px-8 pointer-events-none">
            <button
              className="p-4 rounded-full bg-gray-800/60 backdrop-blur-sm text-white hover:bg-gray-700/80 transition-all duration-300 pointer-events-auto shadow-lg hover:shadow-xl hover:-translate-x-1"
              onClick={() => paginate(-1)}
            >
              <FiArrowLeft size={24} />
            </button>
            <button
              className="p-4 rounded-full bg-gray-800/60 backdrop-blur-sm text-white hover:bg-gray-700/80 transition-all duration-300 pointer-events-auto shadow-lg hover:shadow-xl hover:translate-x-1"
              onClick={() => paginate(1)}
            >
              <FiArrowRight size={24} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 shadow ${
                  index === currentSlide 
                    ? 'bg-white w-8 shadow-lg' 
                    : 'bg-gray-400/60 hover:bg-white/80 hover:shadow-lg'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider moderno entre slider y productos */}
      <div className="flex justify-center my-8">
        <div className="w-2/3 h-1 rounded-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 shadow-lg opacity-70" />
      </div>

      {/* Featured Products */}
      <section className="py-16 w-full bg-transparent">
        <div className="w-full px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
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
      <section className="py-16 w-full bg-transparent">
        <div className="w-full px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-gray-200 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Envío Gratis</h3>
              <p className="text-gray-300">En compras mayores a $50</p>
            </div>
            <div className="p-6">
              <div className="text-gray-200 text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Calidad Premium</h3>
              <p className="text-gray-300">Materiales de primera calidad</p>
            </div>
            <div className="p-6">
              <div className="text-gray-200 text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Pago Seguro</h3>
              <p className="text-gray-300">Múltiples métodos de pago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 