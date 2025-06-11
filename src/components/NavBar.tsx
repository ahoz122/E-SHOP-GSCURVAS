import { Button } from "primereact/button";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CartModal from "../modals/CartModal";
import { useShopStore } from "../stores/shopStore";
import { motion, AnimatePresence } from "framer-motion";

const NavBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cart } = useShopStore();
  const [prevQuantity, setPrevQuantity] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (prevQuantity !== totalQuantity && prevQuantity !== 0) {
      setIsRotating(true);
      const timer = setTimeout(() => {
        setIsRotating(false);
      }, 500); // Duration of animation
      return () => clearTimeout(timer);
    }
    setPrevQuantity(totalQuantity);
  }, [totalQuantity, prevQuantity]);

  return (
    <>
      <nav className="fixed top-0 w-full z-3 shadow-lg bg-neutral-900 flex justify-center">
        <div
          className="w-full px-4 flex justify-between items-center"
          style={{ height: "4rem", maxWidth: "1270px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center">
                <motion.h1
                className="text-xl font-bold text-white cursor-pointer"
                style={{
                  letterSpacing: "0.1em",
                  fontFamily: '"Times New Roman", Times, serif',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                translate="no"
                >
                L U X P H E S
                </motion.h1>
            </Link>
          </motion.div>
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  icon="pi pi-shopping-cart"
                  className="p-button-text p-button-plain text-white"
                  aria-label="Carrito"
                  onClick={() => setIsModalOpen(true)}
                />
              </motion.div>
              {totalQuantity > 0 && (
                <motion.span
                  className="absolute bottom-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full text-[10px]"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    rotate: isRotating ? [0, 180, 360] : 0
                  }}
                  transition={
                    isRotating 
                      ? { 
                          duration: 0.5, 
                          ease: "easeInOut" 
                        } 
                      : { 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 15 
                        }
                  }
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={totalQuantity}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {totalQuantity}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </nav>
      <CartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default NavBar;
