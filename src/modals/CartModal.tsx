import React from "react";
import { Modal } from "../components/Modal";
import { CartItem } from "../types/types";
import SmNumberButton from "../components/SmNumberButton";
import { useShopStore } from "../stores/shopStore";
import { FaWhatsapp, FaTrash, FaCreditCard } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useShopStore();

  const getWhatsAppLink = (phone: string, message: string) => {
    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
      message
    )}`;
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const calculateTotal = () => {
    return cart
      .reduce((sum, item: CartItem) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleWhatsappCheckout = () => {
    if (cart.length === 0) return;

    let message = "Hola! Me gustaría realizar este pedido:\n";

    cart.forEach((item) => {
      message += `*${item.product.name}*\n`;

      // Add variant details if available
      if (Object.keys(item.details).length > 0) {
        Object.entries(item.details).forEach(([type, value]) => {
          message += `- ${type}: ${value}\n`;
        });
      }

      message += `- Cantidad: ${item.quantity}\n`;
      message += `- Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `*TOTAL: $${calculateTotal()}*`;

    const whatsappLink = getWhatsAppLink("593982891603", message);
    window.open(whatsappLink, "_blank");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const totalVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3 } },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Carrito"
    
      showCloseButton
      modalConfig={{ height: "auto" }}
    >
      <div className="px-1 md:px-4">
        {cart.length ? (
          <motion.div
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-h-[60vh] overflow-y-auto pr-1 pb-2">
              <AnimatePresence>
                {cart.map((item) => {
                  const totalPrice = (item.price * item.quantity).toFixed(2);

                  return (
                    <motion.div
                      key={item.id}
                      className="mb-4 bg-white rounded-lg p-3 shadow-sm transition-all hover:shadow-md"
                      layout
                      variants={itemVariants}
                      exit="exit"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Image container */}
                        <motion.div
                          className="w-20 h-20 flex-shrink-0 relative"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            alt={item.product.name || "Producto"}
                            src={
                              item.image ||
                              "https://www.creativefabrica.com/wp-content/uploads/2021/04/05/Photo-Image-Icon-Graphics-10388619-1.jpg"
                            }
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </motion.div>

                        {/* Content wrapper */}
                        <div className="flex-1 min-w-0">
                          {/* Product details */}
                          <div className="space-y-1">
                            <h3 className="text-base font-medium text-gray-800 line-clamp-1">
                              {item.product.name}
                            </h3>
                            {/* Display variant details */}
                            {Object.keys(item.details).length > 0 && (
                              <div className="text-sm text-gray-500">
                                {Object.entries(item.details).map(
                                  ([key, value], idx) => (
                                    <p key={idx}>
                                      {key}: {value}
                                    </p>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* Controls and price */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <SmNumberButton
                                value={item.quantity}
                                size="sm"
                                onChange={(value) =>
                                  handleQuantityChange(item.id, value)
                                }
                              />
                              <motion.button
                                onClick={() => handleRemove(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ rotate: 5 }}
                              >
                                <FaTrash size={14} />
                              </motion.button>
                            </div>

                            {/* Price on the right */}
                            <motion.p
                              className="font-medium text-gray-900"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={totalPrice}
                            >
                              ${totalPrice}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <motion.div
              className="border-t border-gray-100 pt-4 mt-auto"
              variants={totalVariants}
            >
              <div className="flex justify-between mb-5">
                <span className="font-medium text-gray-600">Total:</span>
                <motion.span
                  className="font-semibold text-gray-900"
                  key={calculateTotal()}
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  ${calculateTotal()}
                </motion.span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    className="px-4 py-2.5 bg-gray-700 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                    onClick={clearCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Limpiar
                  </motion.button>

                  <motion.button
                    className="px-4 py-2.5 bg-[#155b51] rounded-md hover:bg-[#124a42] transition-colors text-white flex items-center justify-center gap-2 text-sm font-medium"
                    onClick={handleWhatsappCheckout}
                    disabled={cart.length === 0}
                    whileHover={{ backgroundColor: "#124a42", scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FaWhatsapp size={18} /> WhatsApp
                  </motion.button>
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full px-4 py-2.5 bg-pink-600 rounded-md hover:bg-pink-700 transition-colors text-white flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FaCreditCard size={18} /> Pagar con tarjeta
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-40 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
            <motion.button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-md text-sm font-medium"
              whileHover={{ scale: 1.03, backgroundColor: "#e5e7eb" }}
              whileTap={{ scale: 0.97 }}
            >
              Continuar comprando
            </motion.button>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};

export default CartModal;
