import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { FiExternalLink, FiShoppingBag } from 'react-icons/fi';

const WHATSAPP_NUMBER = '593982891603';
const WHATSAPP_CATALOG_URL = `https://wa.me/c/${WHATSAPP_NUMBER}`; // URL del catálogo de WhatsApp Business

const WhatsAppCatalog: React.FC = () => {
  const openCatalog = () => {
    window.open(WHATSAPP_CATALOG_URL, '_blank');
  };

  const askAvailability = () => {
    const message = '¡Hola! Me gustaría consultar la disponibilidad y precios actualizados de las fajas 👗';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Catálogo de WhatsApp Business</h2>
        <p className="text-gray-600">
          Explora nuestro catálogo completo con precios actualizados y disponibilidad en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Botón del Catálogo */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCatalog}
          className="p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors text-center"
        >
          <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaWhatsapp size={32} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Ver Catálogo Completo</h3>
          <p className="text-gray-600 text-sm mb-4">
            Accede a nuestro catálogo oficial en WhatsApp Business
          </p>
          <span className="inline-flex items-center text-green-600 font-medium">
            Abrir Catálogo <FiExternalLink className="ml-2" />
          </span>
        </motion.button>

        {/* Botón de Consulta */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={askAvailability}
          className="p-6 border-2 border-pink-500 rounded-lg hover:bg-pink-50 transition-colors text-center"
        >
          <div className="bg-pink-100 text-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShoppingBag size={32} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Consultar Disponibilidad</h3>
          <p className="text-gray-600 text-sm mb-4">
            Pregunta por tallas, colores y precios actualizados
          </p>
          <span className="inline-flex items-center text-pink-600 font-medium">
            Consultar Ahora <FaWhatsapp className="ml-2" />
          </span>
        </motion.button>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">¿Por qué usar nuestro catálogo de WhatsApp?</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✨ Precios siempre actualizados</li>
          <li>🎨 Disponibilidad en tiempo real de tallas y colores</li>
          <li>📸 Fotos detalladas de cada producto</li>
          <li>💬 Atención personalizada instantánea</li>
          <li>🛍️ Proceso de compra sencillo y seguro</li>
        </ul>
      </div>
    </div>
  );
};

export default WhatsAppCatalog; 