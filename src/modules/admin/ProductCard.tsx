// ProductCard.tsx (updated)
import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Product, Category } from "../../types/types";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getCategoryById } from "../../firebase/firestoreService";

interface ProductCardProps {
  prod: Product;
  editProduct: (prod: Product) => void;
  deleteProduct: (prod: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  prod,
  editProduct,
  deleteProduct,
}) => {
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (prod.categoryId) {
      getCategoryById(prod.categoryId).then(setCategory);
    }
  }, [prod.categoryId]);

  const confirmDelete = () => {
    confirmDialog({
      header: "Eliminar producto",
      message: `¿Eliminar "${prod.name}"?`,
      className: "my-minimal-confirm-dialog",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      accept: () => deleteProduct(prod),
    });
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <ConfirmDialog />
      <div className="flex gap-4 h-32">
        <div className="w-[30%] h-full shrink-0">
          <div className="w-full h-full relative">
            <img
              src={prod.images![0] || "https://via.placeholder.com/150"}
              alt={prod.name}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              {prod.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {category?.name || "Sin categoría"}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between items-end">
          <div className="flex flex-col items-end">
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-text p-button-sm text-[#155b51] hover:bg-[#155b51]/10"
              onClick={() => editProduct(prod)}
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-text p-button-sm text-[#155b51] hover:bg-[#155b51]/10"
              onClick={confirmDelete}
            />
          </div>
          <p className="text-lg font-semibold text-blue-600 mt-auto px-2">
            ${prod.defaultPrice?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </Card>
  );
};
