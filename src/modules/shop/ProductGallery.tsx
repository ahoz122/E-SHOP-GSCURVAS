import { useState, useEffect } from "react";
import { ProductCard } from "../../components/ProductCard";
import { useNavigate } from "react-router-dom";
import BannerCarousel from "../../components/BannerCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../../types/types";
import { useShopStore } from "../../stores/shopStore";
import "../admin/SearchBarStyles.css";

const ProductGallery = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Nuevos estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { fetchProducts, products } = useShopStore();

  const handleCardClick = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  // Función para limpiar la búsqueda
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    fetchProducts().then(() => {
      setIsLoading(false);
      setFilteredProducts(products); // Inicializar los productos filtrados
    });
  }, []);

  useEffect(() => {
    if (searchTerm === "/admin") {
      navigate("/admin");
      return;
    }

    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(lowercaseSearch) ||
          product.brand?.toLowerCase().includes(lowercaseSearch) ||
          product.categoryId?.toLowerCase().includes(lowercaseSearch) ||
          product.description?.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.8,
      },
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const pageTransition = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const loaderVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };
  return (
    <motion.div
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransition}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="flex flex-col justify-center items-center h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full"
              variants={loaderVariants}
              animate="animate"
            ></motion.div>
            <motion.p
              className="mt-4 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
            >
              Cargando productos...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pt-15" />

            {/* Carrusel con animaciones */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <BannerCarousel />
            </motion.div>

            {/* Barra de búsqueda (NUEVO) - Colocada después del carrusel */}
            <motion.div
              className="mb-4 mx-3 mt-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <motion.div
                className={`flex items-center px-3 py-2 bg-white rounded-lg ${
                  isSearchFocused ? "shadow-md" : "shadow-sm"
                }`}
                animate={{
                  boxShadow: isSearchFocused
                    ? "0 4px 8px -2px rgba(0, 0, 0, 0.06)"
                    : "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                transition={{ duration: 0.2 }}
              >
                <i
                  className={`pi pi-search px-2 mr-2 ${
                    isSearchFocused || searchTerm
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                ></i>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar productos..."
                  className="custom-search-input w-full bg-transparent text-gray-700"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />

                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      className="text-gray-400 hover:text-gray-600 ml-1"
                      onClick={handleClearSearch}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <i className="pi pi-times"></i>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {searchTerm && (
                  <motion.div
                    className="mt-1 text-xs text-gray-500 ml-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filteredProducts.length} resultado
                    {filteredProducts.length !== 1 ? "s" : ""}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence mode="wait">
              {filteredProducts && filteredProducts.length > 0 ? (
                <motion.div
                  key="products"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-3"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={containerVariants}
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover={{
                        y: -8,
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      custom={index}
                    >
                      <ProductCard
                        product={product}
                        handleCardClick={() => handleCardClick(product)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.i
                    className="pi pi-shopping-bag text-5xl text-gray-300 mb-4 block"
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: [0.8, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 1, delay: 0.2 }}
                  ></motion.i>
                  <motion.h3
                    className="text-xl font-medium mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {searchTerm
                      ? `No hay resultados para "${searchTerm}"`
                      : "No hay productos disponibles"}
                  </motion.h3>
                  <motion.p
                    className="text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {searchTerm
                      ? "Intenta con otros términos de búsqueda"
                      : "Intenta buscar en otra categoría o vuelve más tarde"}
                  </motion.p>
                  {searchTerm && (
                    <motion.button
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClearSearch}
                    >
                      Limpiar búsqueda
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón flotante para volver arriba (mantener igual) */}
            <motion.button
              className="fixed bottom-6 right-6 bg-[#155b51] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <i className="pi pi-arrow-up"></i>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGallery;
