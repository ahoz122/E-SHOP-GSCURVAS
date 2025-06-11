import React from 'react';
import { FaWhatsapp, FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';

interface OrderStatusProps {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

const WHATSAPP_NUMBER = '593982891603';

const OrderStatus: React.FC<OrderStatusProps> = ({ orderId, status }) => {
  const statusSteps = [
    { id: 'pending', label: 'Pedido Recibido', icon: <FaBox /> },
    { id: 'processing', label: 'En Preparación', icon: <FaBox /> },
    { id: 'shipped', label: 'En Camino', icon: <FaTruck /> },
    { id: 'delivered', label: 'Entregado', icon: <FaCheckCircle /> },
  ];

  const currentStep = statusSteps.findIndex(step => step.id === status);

  const checkStatus = () => {
    const message = `¡Hola! Me gustaría consultar el estado de mi pedido #${orderId} 📦`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Pedido #{orderId}</h3>
        <button
          onClick={checkStatus}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
        >
          <FaWhatsapp size={20} />
          <span className="text-sm">Consultar por WhatsApp</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        
        <div className="relative z-10 flex justify-between">
          {statusSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs mt-2 text-gray-600">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus; 