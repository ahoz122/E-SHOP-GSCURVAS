// ProductModal.tsx
import React, { useState, useRef, useEffect } from "react";
import { Product } from "../../types/types";
import { Button } from "primereact/button";
import { Modal } from "../../components/Modal";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { motion, AnimatePresence } from "framer-motion";
import { uploadImage } from "../../firebase/cloudinaryService";
import { Toast } from "primereact/toast";
import CustomImageCarousel from "./CustomImageCarousel";
import { Dropdown } from "primereact/dropdown";
import { getCategories } from "../../firebase/firestoreService";
import { Category } from "../../types/types";

const carouselStyles = `
  .p-carousel .p-carousel-content .p-carousel-prev,
  .p-carousel .p-carousel-content .p-carousel-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2.5rem;
    height: 2.5rem;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    z-index: 10;
    border: none;
  }
  
  .p-carousel .p-carousel-content .p-carousel-prev {
    left: 0.5rem;
  }
  
  .p-carousel .p-carousel-content .p-carousel-next {
    right: 0.5rem;
  }
  
  .p-carousel .p-carousel-indicators {
    padding: 0.5rem;
  }
  
  .carousel-container {
    position: relative;
    padding: 0 1rem;
  }
`;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  isEditMode: boolean;
  onSave: () => void;
  openVariantModal: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  setProduct,
  isEditMode,
  onSave,
  openVariantModal,
}) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useRef<Toast>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize preview images when modal opens
  React.useEffect(() => {
    if (isOpen && product.images && product.images.length > 0) {
      setPreviewImages(
        product.images.filter((img) => !img.includes("placeholder"))
      );
    } else if (isOpen) {
      setPreviewImages([]);
    }
  }, [isOpen, product.images]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getCategories()
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudieron cargar las categorías",
            life: 3000,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  const updateProduct = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImageClick = () => {
    if (uploadingIndex === null) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(product.images || [])];
    newImages.splice(index, 1);
    updateProduct("images", newImages);

    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    if (activeImageIndex >= newImages.length) {
      setActiveImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Las imágenes no deben pesar más de 5MB",
          life: 3000,
        });
        continue;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Solo se permiten archivos de imagen",
          life: 3000,
        });
        continue;
      }

      // Create local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImages((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      try {
        setUploadingIndex(product.images?.length || 0);
        setUploadProgress(0);

        const imageUrl = await uploadImage(
          file,
          (progress) => {
            setUploadProgress(progress);
          },
          (error) => {
            toast.current?.show({
              severity: "error",
              summary: "Error de subida",
              detail: error.message,
              life: 3000,
            });
          }
        );

        // Add the new image URL to the product's images array
        updateProduct("images", [...(product.images || []), imageUrl]);

        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Imagen subida correctamente",
          life: 3000,
        });
      } catch (error) {
        console.error("Error al subir imagen:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al subir la imagen. Inténtalo de nuevo.",
          life: 3000,
        });
      } finally {
        setUploadingIndex(null);
        setUploadProgress(0);
      }
    }

    // Clear the input to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 17 },
    },
    tap: { scale: 0.98 },
    hover: { scale: 1.03 },
  };

  return (
    <Modal
      header={isEditMode ? "Editar Producto" : "Nuevo Producto"}
      isOpen={isOpen}
      footer={
        <motion.div
          className="flex flex-wrap justify-between w-full px-4 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            whileHover="hover"
            className="mb-2 sm:mb-0"
          >
            <Button
              label="Gestionar Variantes"
              icon="pi pi-tag"
              onClick={openVariantModal}
              className="p-button-outlined border-blue-500 text-blue-500 hover:bg-blue-50 p-button-sm"
            />
          </motion.div>

          <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileTap="tap"
            whileHover="hover"
          >
            <Button
              label="Guardar"
              icon="pi pi-check"
              onClick={onSave}
              disabled={uploadingIndex !== null}
              className="bg-blue-500 hover:bg-blue-600 border-none p-button-sm"
            />
          </motion.div>
        </motion.div>
      }
      onClose={onClose}
    >
      <style>{carouselStyles}</style>
      <Toast ref={toast} position="top-center" />

      <div className="p-3">
        <motion.div
          className="grid grid-cols-1 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Multiple Image Upload Section */}
          <motion.div className="mb-4 col-span-1" variants={itemVariants}>
            <div className="flex justify-start items-center mb-2">
              <span className="text-xs text-gray-500">
              {previewImages.length} / 10 imágenes
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              {/* Image Carousel */}
              {previewImages.length > 0 ? (
                <>
                  <CustomImageCarousel
                    images={previewImages}
                    activeIndex={activeImageIndex}
                    setActiveIndex={setActiveImageIndex}
                    onRemoveImage={handleRemoveImage}
                    uploadingIndex={uploadingIndex}
                    uploadProgress={uploadProgress}
                    handleAddImageClick={handleAddImageClick}
                  />
                </>
              ) : (
                <div
                  className="flex items-center justify-center h-40 mb-3 bg-gray-100 rounded-lg border border-dashed border-gray-300 cursor-pointer"
                  onClick={handleAddImageClick}
                >
                  <div className="text-center p-4">
                    <i className="pi pi-images text-3xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-500">
                      No hay imágenes del producto
                    </p>
                    <p className="text-xs text-blue-500 mt-2">
                      Haga clic para agregar imágenes
                    </p>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                disabled={uploadingIndex !== null}
              />
            </div>
          </motion.div>

          {/* Product Information Fields */}
          <motion.div className="col-span-1" variants={itemVariants}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <InputText
              id="name"
              value={product.name}
              onChange={(e) => updateProduct("name", e.target.value)}
              className="w-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Marca
              </label>
              <InputText
                id="brand"
                value={product.brand}
                onChange={(e) => updateProduct("brand", e.target.value)}
                className="w-full"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría
              </label>
              <Dropdown
                id="categoryId"
                value={categories.find(cat => cat.id === product.categoryId) || null}
                onChange={(e) => updateProduct("categoryId", e.value?.id || "")}
                options={categories}
                optionLabel="name"
                placeholder={loading ? "Cargando categorías..." : "Seleccionar categoría"}
                className="w-full"
                disabled={loading}
                emptyMessage="No hay categorías disponibles"
              />
            </motion.div>
          </div>

          <motion.div className="col-span-1" variants={itemVariants}>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción
            </label>
            <InputTextarea
              id="description"
              value={product.description}
              onChange={(e) => updateProduct("description", e.target.value)}
              rows={3}
              className="w-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="defaultPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio Base
              </label>
              <InputNumber
                id="defaultPrice"
                value={product.defaultPrice}
                onValueChange={(e) =>
                  updateProduct("defaultPrice", e.value || 0)
                }
                mode="currency"
                currency="MXN"
                locale="es-MX"
                className="w-full"
                minFractionDigits={2}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variantes
              </label>
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.variants?.length || 0}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="bg-gray-50 border border-gray-200 rounded p-2 text-sm flex items-center justify-between"
                >
                  <span className="text-gray-600">
                    {product.variants && product.variants.length > 0
                      ? `${product.variants.length} variante${
                          product.variants.length !== 1 ? "s" : ""
                        }`
                      : "Sin variantes"}
                  </span>
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm p-button-rounded"
                    onClick={openVariantModal}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Variants Summary (if any) */}
          {product.variants && product.variants.length > 0 && (
            <motion.div className="col-span-1 mt-2" variants={itemVariants}>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Resumen de variantes
                </h4>
                <div className="max-h-32 overflow-y-auto">
                  {product.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="text-xs text-blue-700 mb-1 flex items-center"
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-800 mr-2">
                        {index + 1}
                      </span>
                      <span className="font-medium mr-1">{variant.name}:</span>
                      {variant.image && (
                        <i
                          className="pi pi-image ml-2"
                          title="Incluye imagen personalizada"
                        ></i>
                      )}
                     {variant.price && (
                        <i
                          className="pi pi-dollar ml-2"
                          title={`Precio: ${variant.price} MXN`}
                        ></i>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Modal>
  );
};
