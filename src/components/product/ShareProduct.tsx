import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Product } from '../../types/product';

interface ShareProductProps {
  product: Product;
}

const WHATSAPP_NUMBER = '593982891603';

const ShareProduct: React.FC<ShareProductProps> = ({ product }) => {
  const shareOnWhatsApp = () => {
    const message = `¡Mira este producto!\n\n`
      + `${product.name}\n`
      + `${product.description}\n\n`
      + `✨ Características:\n`
      + `- Compresión: ${product.details.compression}\n`
      + `- Material: ${product.details.material.join(', ')}\n`
      + `- Tallas disponibles: ${product.sizes.join(', ')}\n\n`
      + `💰 Precio: $${product.price.toFixed(2)}`
      + (product.discount ? ` (${product.discount.percentage}% OFF!)` : '');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={shareOnWhatsApp}
      className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
    >
      <FaWhatsapp size={20} />
      <span className="text-sm">Compartir por WhatsApp</span>
    </button>
  );
};

export default ShareProduct; 