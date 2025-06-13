import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiX } from 'react-icons/fi';
import { Product } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';
import ShareProduct from './ShareProduct';
import ShapewearIcon from '../icons/ShapewearIcon';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [showOptions, setShowOptions] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor);
    setShowOptions(false);
  };

  const CategroriaCinturilla = product.category === 'cinturilla';

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {product.isNew && (
        <span className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 text-xs rounded-full z-10">
          Nuevo
        </span>
      )}

      {product.discount && (
        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full z-10">
          -{product.discount.percentage}%
        </span>
      )}

      <div className="group relative overflow-hidden aspect-[3/4] bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow-md">
        {product.images.main ? (
          <img
            src={product.images.main}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShapewearIcon className="w-full h-full max-w-[150px] text-gray-400" />
            </motion.div>
          </div>
        )}

        {/* Overlay hover effect */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

        {/* Bottom action buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setShowOptions(true)}
            className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-100 shadow-lg"
          >
            <FiShoppingBag size={18} />
            Agregar al Carrito
          </button>
          <ShareProduct product={product} />
        </div>
      </div>






      <div className="mt-4 px-2">
        <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.details.compression} Compresión</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {product.discount ? (
              <>
                <span className="text-lg font-bold text-red-500">
                  ${(product.price * (1 - product.discount.percentage / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button className="p-2 text-gray-400 hover:text-pink-500 transition-colors">
            <FiHeart size={20} />
          </button>
        </div>
      </div>

      {showOptions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-white p-4 rounded-lg shadow-lg z-20"
        >
          <button
            onClick={() => setShowOptions(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talla
              </label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-full border ${selectedSize === size
                        ? 'border-pink-500 text-pink-500'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name
                        ? 'border-pink-500'
                        : 'border-transparent'
                      }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-pink-500 text-white py-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              Agregar al Carrito
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductCard; 