import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { BsChatDots, BsQuestionCircle, BsBoxSeam } from 'react-icons/bs';

const WHATSAPP_NUMBER = '593982891603';

const quickQuestions = [
  {
    icon: <BsChatDots />,
    text: '¿Necesitas ayuda para elegir tu faja?',
    message: 'Hola! Me gustaría recibir asesoría para elegir una faja 👗'
  },
  {
    icon: <BsQuestionCircle />,
    text: 'Consultar disponibilidad',
    message: 'Hola! Quisiera consultar la disponibilidad de tallas y colores 🎨'
  },
  {
    icon: <BsBoxSeam />,
    text: 'Información de envíos',
    message: 'Hola! Me gustaría información sobre los envíos 📦'
  }
];

const WhatsAppFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg w-72 overflow-hidden mb-4"
          >
            <div className="bg-green-500 text-white p-4">
              <h3 className="font-semibold">¿Cómo podemos ayudarte?</h3>
              <p className="text-sm opacity-90">Selecciona una opción</p>
            </div>
            <div className="p-4 space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question.message)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 text-gray-700"
                >
                  <span className="text-green-500">{question.icon}</span>
                  <span className="text-sm">{question.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
      >
        {isOpen ? <FaTimes size={24} /> : <FaWhatsapp size={24} />}
      </motion.button>
    </div>
  );
};

export default WhatsAppFloat; 