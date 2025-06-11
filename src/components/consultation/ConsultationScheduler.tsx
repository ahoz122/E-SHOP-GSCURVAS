import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiVideo, FiCalendar, FiClock, FiMessageCircle } from 'react-icons/fi';

const WHATSAPP_NUMBER = '593982891603';

interface ConsultationRequest {
  date: string;
  time: string;
  type: 'videollamada' | 'chat';
  notes: string;
}

const ConsultationScheduler: React.FC = () => {
  const [consultation, setConsultation] = useState<ConsultationRequest>({
    date: '',
    time: '',
    type: 'videollamada',
    notes: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setConsultation(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    const message = `¡Hola! Me gustaría agendar una asesoría personalizada:\n\n`
      + `📅 Fecha: ${consultation.date}\n`
      + `⏰ Hora: ${consultation.time}\n`
      + `💬 Tipo: ${consultation.type === 'videollamada' ? 'Videollamada' : 'Chat'}\n`
      + (consultation.notes ? `📝 Notas adicionales:\n${consultation.notes}\n` : '')
      + `\n¿Me podrían confirmar la disponibilidad?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-100 text-pink-600 rounded-full">
          <FiVideo size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Agenda tu Asesoría</h2>
          <p className="text-gray-600">Recibe atención personalizada por videollamada o chat</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tipo de consulta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Asesoría
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`
              flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer
              ${consultation.type === 'videollamada' 
                ? 'border-pink-500 bg-pink-50' 
                : 'border-gray-200 hover:border-pink-200'}
            `}>
              <input
                type="radio"
                name="type"
                value="videollamada"
                checked={consultation.type === 'videollamada'}
                onChange={handleChange}
                className="text-pink-500 focus:ring-pink-500"
              />
              <div>
                <span className="block font-medium">Videollamada</span>
                <span className="text-sm text-gray-500">Asesoría cara a cara</span>
              </div>
            </label>

            <label className={`
              flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer
              ${consultation.type === 'chat' 
                ? 'border-pink-500 bg-pink-50' 
                : 'border-gray-200 hover:border-pink-200'}
            `}>
              <input
                type="radio"
                name="type"
                value="chat"
                checked={consultation.type === 'chat'}
                onChange={handleChange}
                className="text-pink-500 focus:ring-pink-500"
              />
              <div>
                <span className="block font-medium">Chat</span>
                <span className="text-sm text-gray-500">Consulta por mensaje</span>
              </div>
            </label>
          </div>
        </div>

        {/* Fecha y hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline mr-2" />
              Fecha preferida
            </label>
            <input
              type="date"
              name="date"
              value={consultation.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiClock className="inline mr-2" />
              Hora preferida
            </label>
            <input
              type="time"
              name="time"
              value={consultation.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Notas adicionales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FiMessageCircle className="inline mr-2" />
            Notas adicionales
          </label>
          <textarea
            name="notes"
            value={consultation.notes}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            placeholder="Describe brevemente tu objetivo o cualquier pregunta específica que tengas..."
          />
        </div>

        {/* Botón de envío */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <FiVideo size={20} />
          Agendar Asesoría por WhatsApp
        </motion.button>
      </div>
    </div>
  );
};

export default ConsultationScheduler; 