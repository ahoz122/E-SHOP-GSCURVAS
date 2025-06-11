import React from 'react';

const ShapewearIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fondo del icono */}
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="3"
      fill="#FDF2F8"
      stroke="#F9A8D4"
      strokeWidth="1.5"
    />
    
    {/* Silueta de la faja */}
    <path
      d="M7 6C7 6 9.5 9 12 9C14.5 9 17 6 17 6"
      stroke="#EC4899"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    <path
      d="M7 18C7 18 9.5 15 12 15C14.5 15 17 18 17 18"
      stroke="#EC4899"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    {/* Detalles decorativos */}
    <path
      d="M12 6V18"
      stroke="#EC4899"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    
    {/* Detalles laterales */}
    <path
      d="M8 9C8 9 8 12 8 12C8 12 8 15 8 15"
      stroke="#F9A8D4"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    <path
      d="M16 9C16 9 16 12 16 12C16 12 16 15 16 15"
      stroke="#F9A8D4"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    {/* Detalles decorativos adicionales */}
    <circle cx="12" cy="12" r="1" fill="#EC4899" />
    <circle cx="12" cy="9" r="0.5" fill="#EC4899" />
    <circle cx="12" cy="15" r="0.5" fill="#EC4899" />
  </svg>
);

export default ShapewearIcon; 