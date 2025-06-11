import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { motion, AnimatePresence } from "framer-motion";
import { Variant } from "../../types/types";
import { Modal } from "../../components/Modal";
import { uploadImage } from "../../firebase/cloudinaryService";
import { InputText } from "primereact/inputtext";

interface VariantEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: Variant;
  onSave: (variant: Variant) => void;
}

const VariantEditModal: React.FC<VariantEditModalProps> = ({
  isOpen,
  onClose,
  variant,
  onSave,
}) => {
  const [editedVariant, setEditedVariant] = useState<Variant>(() => ({
    type: variant.type || "",
    name: variant.name || "",
    image: variant.image || "",
    price: variant.price || "",
  }));

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useRef<Toast>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("Variant received for editing:", variant);
    setEditedVariant({
      type: variant.type || "",
      name: variant.name || "",
      image: variant.image || "",
      price: variant.price || "",
    });
  }, [variant]);

  const variantTypes = [
    { label: "Color", value: "color" },
    { label: "Size", value: "size" },
    { label: "Material", value: "material" },
    { label: "Model", value: "model" },
  ];

  const handleSave = () => {
    if (!editedVariant.type || !editedVariant.name) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El tipo y nombre son obligatorios",
        life: 3000,
      });
      return;
    }

    onSave(editedVariant);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Las imágenes no deben pesar más de 5MB",
        life: 3000,
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Solo se permiten archivos de imagen",
        life: 3000,
      });
      return;
    }

    try {
      setIsUploading(true);
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

      setEditedVariant((prev) => ({ ...prev, image: imageUrl }));

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
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

  const isNewVariant = !variant.name && !variant.type;
  const modalTitle = isNewVariant ? "Añadir Variante" : "Editar Variante";

  return (
    <Modal
      header={modalTitle}
      isOpen={isOpen}
      footer={
        <div className="flex justify-end w-full px-4 py-2">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text mr-2"
            onClick={onClose}
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 border-none"
          />
        </div>
      }
      onClose={onClose}
    >
      <Toast ref={toast} position="top-center" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="p-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <Dropdown
              value={editedVariant.type}
              options={variantTypes}
              onChange={(e) =>
                setEditedVariant({ ...editedVariant, type: e.value })
              }
              placeholder="Seleccionar tipo"
              className="w-full"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <InputText
              value={editedVariant.name}
              onChange={(e) =>
                setEditedVariant({ ...editedVariant, name: e.target.value })
              }
              placeholder="Nombre de la variante"
              className="w-full"
            />
          </motion.div>

            <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <InputNumber
              value={editedVariant.price ? parseFloat(editedVariant.price) : null}
              onValueChange={(e) => {
              setEditedVariant({
                ...editedVariant,
                price: e.value?.toString() || "",
              });
              }}
              placeholder="$"
              className="w-full"
              minFractionDigits={0}
              maxFractionDigits={2}
            />
            </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>

            {editedVariant.image && (
              <div className="mt-3 relative">
                <img
                  src={editedVariant.image}
                  alt="Vista previa"
                  className="w-full h-32 object-cover rounded-md shadow-sm border border-gray-200 transition-all hover:shadow-md"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-sm shadow-md"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      fontSize: "0.8rem",
                      background: "rgba(220, 53, 69, 0.9)", // Changed to red background with opacity
                    }}
                    onClick={() =>
                      setEditedVariant({ ...editedVariant, image: "" })
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 mt-2">
              <Button
                label={
                  isUploading
                    ? `Subiendo ${uploadProgress.toFixed(0)}%`
                    : "Subir imagen"
                }
                icon="pi pi-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`p-button-outlined w-full ${
                  isUploading ? "p-button-info" : ""
                }`}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Modal>
  );
};

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedVariants: Variant[];
  setEditedVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
  onSave: () => void;
}

const VariantModal: React.FC<VariantModalProps> = ({
  isOpen,
  onClose,
  editedVariants,
  setEditedVariants,
  onSave,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<Variant>({
    type: "",
    name: "",
    image: "",
    price: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const toast = useRef<Toast>(null);

  const openAddModal = () => {
    setCurrentVariant({
      type: "",
      name: "",
      image: "",
      price: "",
    });
    setEditIndex(null);
    setIsEditModalOpen(true);
  };

  const openEditModal = (variant: Variant, index: number) => {
    console.log("Opening edit modal for variant:", variant); // Add for debugging
    // Create a fresh copy of the variant object
    setCurrentVariant({
      type: variant.type || "",
      name: variant.name || "",
      image: variant.image || "",
      price: variant.price || "",
    });
    setEditIndex(index);
    setIsEditModalOpen(true);
  };
  const handleRemoveVariant = (index: number) => {
    const updatedVariants = [...editedVariants];
    updatedVariants.splice(index, 1);
    setEditedVariants(updatedVariants);
  };

  const handleSaveVariant = (variant: Variant) => {
    if (editIndex !== null) {
      // Update existing variant
      const updatedVariants = [...editedVariants];
      updatedVariants[editIndex] = variant;
      setEditedVariants(updatedVariants);
    } else {
      // Add new variant
      setEditedVariants([...editedVariants, variant]);
    }

    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail:
        editIndex !== null
          ? "Variante actualizada correctamente"
          : "Variante añadida correctamente",
      life: 3000,
    });
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

  const variantCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <Modal
        header="Gestionar Variantes"
        isOpen={isOpen}
        footer={
          <div className="flex justify-end w-full px-4 py-2">
            <Button
              label="Guardar"
              icon="pi pi-check"
              onClick={onSave}
              className="bg-blue-500 hover:bg-blue-600 border-none"
            />
          </div>
        }
        onClose={onClose}
      >
        <Toast ref={toast} position="top-center" />

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Variantes existentes</h3>
            <Button
              label="Añadir variante"
              icon="pi pi-plus"
              onClick={openAddModal}
              className="bg-blue-500 hover:bg-blue-600 border-none"
            />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {editedVariants.map((variant, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  variants={variantCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {variant.type}
                      </span>
                      <h4 className="text-md font-semibold mt-1">
                        {variant.name}
                      </h4>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-text p-button-rounded p-button-sm"
                        onClick={() => openEditModal(variant, index)}
                      />
                      <Button
                        icon="pi pi-trash"
                        className="p-button-text p-button-rounded p-button-danger p-button-sm"
                        onClick={() => handleRemoveVariant(index)}
                      />
                    </div>
                  </div>

                  {variant.price && (
                    <p className="text-sm text-gray-700">
                      Precio: ${variant.price}
                    </p>
                  )}

                  {variant.image && (
                    <div className="mt-2">
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {editedVariants.length === 0 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No hay variantes creadas</p>
            </div>
          )}
        </div>
      </Modal>

      <VariantEditModal
        key={editIndex !== null ? `edit-${editIndex}` : "add-new"}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        variant={currentVariant}
        onSave={handleSaveVariant}
      />
    </>
  );
};

export default VariantModal;
