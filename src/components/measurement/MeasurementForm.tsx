import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiSend } from 'react-icons/fi';

interface Measurements {
  cintura: string;
  cadera: string;
  busto: string;
  altura: string;
  peso: string;
  objetivo: 'postparto' | 'ejercicio' | 'diario' | 'postquirurgico';
}

const WHATSAPP_NUMBER = '593982891603';

const measurementGuides = {
  cintura: {
    image: '/images/measure-waist.png', // Necesitarás agregar estas imágenes
    instructions: 'Mide alrededor de la parte más estrecha de tu cintura, generalmente a la altura del ombligo.'
  },
  cadera: {
    image: '/images/measure-hip.png',
    instructions: 'Mide alrededor de la parte más ancha de tus caderas.'
  },
  busto: {
    image: '/images/measure-bust.png',
    instructions: 'Mide alrededor de la parte más llena del busto.'
  }
};

const objetivos = [
  { id: 'postparto', label: 'Post-Parto', description: 'Recuperación y soporte después del embarazo' },
  { id: 'ejercicio', label: 'Ejercicio', description: 'Soporte durante actividad física' },
  { id: 'diario', label: 'Uso Diario', description: 'Modelado y comodidad para el día a día' },
  { id: 'postquirurgico', label: 'Post-Quirúrgico', description: 'Soporte y compresión después de cirugía' }
];

const MeasurementForm: React.FC = () => {
  const [measurements, setMeasurements] = useState<Measurements>({
    cintura: '',
    cadera: '',
    busto: '',
    altura: '',
    peso: '',
    objetivo: 'diario'
  });

  const [currentGuide, setCurrentGuide] = useState<keyof typeof measurementGuides | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMeasurements(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getSizeRecommendation = () => {
    // Lógica simplificada para recomendación de talla
    const cintura = parseInt(measurements.cintura);
    const cadera = parseInt(measurements.cadera);
    
    if (!cintura || !cadera) return null;

    if (cintura < 65) return 'XS';
    if (cintura < 75) return 'S';
    if (cintura < 85) return 'M';
    if (cintura < 95) return 'L';
    return 'XL';
  };

  const handleSubmit = () => {
    const recommendation = getSizeRecommendation();
    const message = `¡Hola! Me gustaría una asesoría personalizada con mis medidas:\n\n`
      + `📏 Medidas:\n`
      + `- Cintura: ${measurements.cintura}cm\n`
      + `- Cadera: ${measurements.cadera}cm\n`
      + `- Busto: ${measurements.busto}cm\n`
      + `- Altura: ${measurements.altura}cm\n`
      + `- Peso: ${measurements.peso}kg\n\n`
      + `🎯 Objetivo: ${objetivos.find(o => o.id === measurements.objetivo)?.label}\n`
      + (recommendation ? `\n📌 Talla recomendada: ${recommendation}\n` : '')
      + `\n¿Me podrían ayudar con recomendaciones personalizadas?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Formulario de Medidas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campos de medidas */}
        <div className="space-y-4">
          {Object.entries(measurementGuides).map(([field]) => (
            <div key={field}>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)} (cm)
                </label>
                <button
                  type="button"
                  onClick={() => setCurrentGuide(field as keyof typeof measurementGuides)}
                  className="text-pink-500 hover:text-pink-600"
                >
                  <FiInfo size={18} />
                </button>
              </div>
              <input
                type="number"
                name={field}
                value={measurements[field as keyof Measurements]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                placeholder="00"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Altura (cm)
            </label>
            <input
              type="number"
              name="altura"
              value={measurements.altura}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Peso (kg)
            </label>
            <input
              type="number"
              name="peso"
              value={measurements.peso}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="00"
            />
          </div>
        </div>

        {/* Objetivos y recomendación */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo
            </label>
            <div className="space-y-2">
              {objetivos.map(objetivo => (
                <label key={objetivo.id} className="flex items-start p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="objetivo"
                    value={objetivo.id}
                    checked={measurements.objetivo === objetivo.id}
                    onChange={handleChange}
                    className="mt-1 text-pink-500 focus:ring-pink-500"
                  />
                  <div className="ml-3">
                    <span className="block font-medium">{objetivo.label}</span>
                    <span className="block text-sm text-gray-500">{objetivo.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {getSizeRecommendation() && (
            <div className="p-4 bg-pink-50 rounded-lg">
              <h3 className="font-medium text-pink-800">Talla Recomendada</h3>
              <p className="text-2xl font-bold text-pink-600 mt-1">
                {getSizeRecommendation()}
              </p>
              <p className="text-sm text-pink-700 mt-2">
                Esta es una recomendación basada en tus medidas. Para una asesoría más precisa, envíanos tus medidas.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
        >
          <FiSend size={18} />
          Enviar medidas por WhatsApp
        </button>
      </div>

      {/* Guía de medición */}
      {currentGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setCurrentGuide(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              Cómo medir: {currentGuide.charAt(0).toUpperCase() + currentGuide.slice(1)}
            </h3>
            <img
              src={measurementGuides[currentGuide].image}
              alt={`Cómo medir ${currentGuide}`}
              className="w-full h-48 object-contain mb-4"
            />
            <p className="text-gray-600">
              {measurementGuides[currentGuide].instructions}
            </p>
            <button
              onClick={() => setCurrentGuide(null)}
              className="mt-4 w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Entendido
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MeasurementForm; 