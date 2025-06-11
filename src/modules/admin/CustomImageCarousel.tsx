import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "primereact/progressbar"; // Adding missing import

interface CustomImageCarouselProps {
  images: string[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onRemoveImage: (index: number) => void;
  uploadingIndex?: number | null;
  uploadProgress: number;
  handleAddImageClick?: () => void;
}

const CustomImageCarousel: React.FC<CustomImageCarouselProps> = ({
  images,
  activeIndex,
  setActiveIndex,
  onRemoveImage,
  uploadingIndex,
  uploadProgress,
  handleAddImageClick = () => {},
}) => {
  if (!images || images.length === 0) return null;

  const navigate = (direction: number): void => {
    const newIndex = (activeIndex + direction + images.length) % images.length;
    setActiveIndex(newIndex);
  };

  return (
    <div className="mb-4">
      {/* Visor principal de imagen */}
      <div className="relative aspect-square rounded-lg overflow-hidden mb-2 border border-gray-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <img
              src={images[activeIndex]}
              alt={`Producto ${activeIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Botón eliminar (ahora dentro de la imagen) */}
            <motion.button
              className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 shadow-md z-10 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage(activeIndex);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={uploadingIndex === activeIndex}
            >
              <i className="pi pi-trash"></i>
            </motion.button>

            {/* Indicador de carga */}
            {uploadingIndex === activeIndex && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
                <div className="w-full max-w-xs">
                  <ProgressBar value={uploadProgress} className="h-2 mb-2" />
                  <p className="text-sm text-center">
                    {Math.round(uploadProgress)}% completado
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <motion.button
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 shadow-md z-10 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="pi pi-chevron-left"></i>
            </motion.button>

            <motion.button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 shadow-md z-10 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="pi pi-chevron-right"></i>
            </motion.button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className={`aspect-square rounded overflow-hidden border-2 cursor-pointer ${
              i === activeIndex ? "border-blue-500" : "border-gray-200"
            }`}
            onClick={() => setActiveIndex(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={img}
              alt={`Miniatura ${i}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}

        {/* Botón para agregar imagen */}
        {images.length < 10 && (
          <motion.div
            className="aspect-square border-2 border-dashed border-gray-300 hover:border-blue-400 rounded flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddImageClick}
          >
            <i className="pi pi-plus text-gray-400"></i>
          </motion.div>
        )}
      </div>

      {/* Indicadores (puntos) */}
      {images.length > 1 && (
        <div className="flex justify-center mt-2">
          {images.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 mx-1 rounded-full ${
                i === activeIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setActiveIndex(i)}
              whileHover={{ scale: 1.2 }}
              animate={{ scale: i === activeIndex ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomImageCarousel;
