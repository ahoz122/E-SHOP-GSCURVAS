// AdminProducts.tsx (updated)
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Product, Variant } from "../../types/types";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../firebase/firestoreService";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import "./SearchBarStyles.css";
import VariantModal from "./VariantModal";

// Admin products component
const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayDialog, setDisplayDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    brand: "",
    description: "",
    images: [],
    defaultPrice: 0,
    categoryId: "",
    variants: [],
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Function to load products from Firestore
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getProducts();
      console.log("Products:", fetchedProducts);
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add these state variables after your other useState declarations
  const [displayVariantModal, setDisplayVariantModal] = useState(false);
  const [editedVariants, setEditedVariants] = useState<Variant[]>([]);

  // Add this function to open the variant modal
  const openVariantModal = () => {
    setEditedVariants(product.variants || []);
    setDisplayVariantModal(true);
  };

  // Add this function to save variants
  const saveVariants = (variants: Variant[]) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      variants: variants,
    }));
    setDisplayVariantModal(false);
  };

  useEffect(() => {
    // Minimum loading time for animation
    const loadingTimer = setTimeout(() => {
      fetchProducts();
    }, 800);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Filter products when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = products.filter(
        (prod) =>
          prod.name.toLowerCase().includes(lowercaseSearch) ||
          prod.brand?.toLowerCase().includes(lowercaseSearch) ||
          (prod.categoryId &&
            prod.categoryId.toLowerCase().includes(lowercaseSearch)) ||
          prod.description?.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const openNew = () => {
    setProduct({
      id: "",
      name: "",
      brand: "",
      description: "",
      images: [],
      defaultPrice: 0,
      categoryId: "",
      variants: [],
    });
    setIsEditMode(false);
    setDisplayDialog(true);
  };

  const editProduct = (prod: Product) => {
    setProduct(prod);
    setIsEditMode(true);
    setDisplayDialog(true);
  };

  const handleDeleteProduct = async (prod: Product) => {
    try {
      await deleteProduct(prod.id);
      // Update local state after deletion
      setProducts(products.filter((p) => p.id !== prod.id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const saveProduct = async () => {
    try {
      if (isEditMode) {
        // Update existing product
        await updateProduct(product.id, product);
        // Update local state
        const updatedProducts = products.map((p) =>
          p.id === product.id ? product : p
        );
        setProducts(updatedProducts);
      } else {
        // Add new product
        const newId = await addProduct({ ...product });
        // Update local state with the new product including its id
        const newProduct = { ...product, id: newId };
        setProducts([...products, newProduct]);
      }
      setDisplayDialog(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: 0.3,
      },
    },
  };

  const fabButtonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.5,
      },
    },
    tap: { scale: 0.9 },
    hover: {
      scale: 1.1,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  return (
    <>
      {!isLoading && <AdminNavbar />}

      <div className="p-3 min-h-screen bg-gray-50">
        <AnimatePresence mode="wait">
          {isLoading ? (
            // Loading component
            <motion.div
              key="loading-screen"
              className="fixed inset-0 flex items-center justify-center bg-white z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.5 },
              }}
            >
              <div className="text-center px-4">
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.2 },
                  }}
                >
                  <div className="relative">
                    <motion.div
                      className="w-20 h-20 rounded-full border-4 border-blue-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500"
                        animate={{
                          rotate: 360,
                          transition: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          },
                        }}
                      ></motion.div>
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 flex items-center justify-center text-blue-500"
                      initial={{ scale: 0 }}
                      animate={{
                        scale: 1,
                        transition: {
                          delay: 0.3,
                          type: "spring",
                          stiffness: 200,
                        },
                      }}
                    >
                      <i className="pi pi-shopping-bag text-xl"></i>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h2
                  className="text-xl font-medium text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.3 },
                  }}
                >
                  Cargando productos
                </motion.h2>
              </div>
            </motion.div>
          ) : (
            // Main content
            <div className="max-w-5xl mx-auto p-2">
              <motion.div
                className="mb-4"
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

              <motion.div
                key="content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredProducts.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      layout
                    >
                      {filteredProducts.map((prod) => (
                        <motion.div
                          key={prod.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <ProductCard
                            prod={prod}
                            editProduct={editProduct}
                            deleteProduct={handleDeleteProduct}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    // Empty state
                    <motion.div
                      className="col-span-full py-16 text-center text-gray-500 bg-white rounded-lg shadow-sm"
                      variants={emptyStateVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          transition: { delay: 0.4, duration: 0.3 },
                        }}
                      >
                        {searchTerm ? (
                          <i className="pi pi-filter-slash text-5xl text-gray-300 mb-4 block"></i>
                        ) : (
                          <i className="pi pi-shopping-bag text-5xl text-gray-300 mb-4 block"></i>
                        )}
                      </motion.div>
                      <h3 className="text-xl font-medium mb-2">
                        {searchTerm
                          ? `No hay resultados para "${searchTerm}"`
                          : "No hay productos disponibles"}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {searchTerm
                          ? "Intenta con otros términos de búsqueda"
                          : "Comienza agregando tu primer producto"}
                      </p>
                      {!searchTerm && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            label="Agregar Producto"
                            icon="pi pi-plus"
                            onClick={openNew}
                            className="bg-blue-500 hover:bg-blue-600 border-none"
                          />
                        </motion.div>
                      )}
                      {searchTerm && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            label="Limpiar búsqueda"
                            icon="pi pi-times"
                            onClick={handleClearSearch}
                            className="p-button-outlined border-gray-300 text-gray-600 hover:bg-gray-50"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <ProductModal
          isOpen={displayDialog}
          onClose={() => setDisplayDialog(false)}
          product={product}
          setProduct={setProduct}
          isEditMode={isEditMode}
          onSave={saveProduct}
          openVariantModal={openVariantModal}
        />

        <VariantModal
          isOpen={displayVariantModal}
          onClose={() => setDisplayVariantModal(false)}
          editedVariants={editedVariants}
          setEditedVariants={setEditedVariants}
          onSave={() => saveVariants(editedVariants)}
        />

        {/* Floating button to add product */}
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              className="fixed bottom-6 right-6 z-10"
              variants={fabButtonVariants}
              initial="hidden"
              animate="visible"
              whileTap="tap"
              whileHover="hover"
              exit={{ scale: 0, opacity: 0 }}
            >
              <Button
                icon="pi pi-plus"
                className="p-button-rounded shadow-lg bg-blue-500 hover:bg-blue-600 border-none"
                onClick={openNew}
                style={{ width: "3.5rem", height: "3.5rem" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminProducts;
