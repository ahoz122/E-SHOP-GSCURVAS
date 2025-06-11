// components/ProductCard.tsx
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import ClipLoader from "react-spinners/PulseLoader";
import { Product, Variant } from "../types/types";
import localImage from "/assets/image.png";
import Card from "./Card";
import { getWhatsAppLink } from "../utils/whatsappUtils";
import { useShopStore } from "../stores/shopStore";

export const ProductCard = ({
  product,
  handleCardClick,
}: {
  product: Product;
  handleCardClick: (product: Product) => void;
}) => {
  // Use default price directly from product
  const displayPrice = product.defaultPrice || 0;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = product.images![0] || localImage;
    img.onload = () => setImageLoaded(true);
  }, [product.images]);

  const handleWhatsappClick = (product: Product, selectedVariant?: Variant) => {
    if (!product) return;

    let message = `¡Hola! Estoy interesado en el producto ${product.name}`;

    // Agregar información de la variante seleccionada si existe
    if (selectedVariant) {
      message += ` en ${selectedVariant.name}`;
      if (selectedVariant.price) {
        message += ` por $${selectedVariant.price}`;
      }
    }

    const whatsappLink = getWhatsAppLink("593982891603", message);
    window.open(whatsappLink, "_blank");
  };

  const handleAddToCart = (
    selectedProduct: Product,
    selectedVariant?: Variant
  ) => {
    if (selectedProduct) {
      const { addToCart } = useShopStore.getState();

      if (selectedVariant) {
        // Create a proper variant mapping using the variant's type as the key
        const variantDetails = { [selectedVariant.type]: selectedVariant.name };

        // Convert price from string to number if needed
        const variantPrice = selectedVariant.price
          ? parseFloat(selectedVariant.price)
          : selectedProduct.defaultPrice;

        addToCart(
          selectedProduct,
          1,
          variantDetails,
          variantPrice,
          selectedVariant.image || selectedProduct.images?.[0] || ""
        );
      } else {
        // Add product with default values
        addToCart(selectedProduct, 1);
      }

      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
      }, 500);
    }
  };

  return (
    <div onClick={() => handleCardClick(product)} className="cursor-pointer">
      <Card
        className="relative h-full flex flex-col min-h-[310px] shadow-md hover:shadow-lg transition-shadow rounded-sm"
        imageUrl={product.images![0] || localImage}
      >
        {/* Spinner overlay until the image is loaded */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/70 z-10">
            <ClipLoader size={15} color="white" speedMultiplier={0.5} />
          </div>
        )}
        <span className="text-base font-semibold block truncate">
          {product.name}
        </span>
        {product.brand && (
          <h3 className="text-sm font-semibold text-gray-400">
            By {product.brand}
          </h3>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2 px-4 bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-bold text-primary">${displayPrice}</span>
          <div className="flex gap-1">
            <Button
              onClick={() => handleWhatsappClick(product)}
              icon="pi pi-whatsapp"
              style={{ backgroundColor: "#155b51", borderColor: "#155b51" }}
              className="p-button-sm p-button-rounded"
            />
            <Button
              onClick={() => handleAddToCart(product)}
              icon={addedToCart ? "pi pi-check" : "pi pi-shopping-bag"}
              style={{
                backgroundColor: addedToCart ? "#155b51" : "gray",
                borderColor: addedToCart ? "#155b51" : "gray",
                transition: "all 0.3s ease-in-out",
              }}
              className={`p-button-sm p-button-rounded ${
                addedToCart ? "scale-110" : ""
              }`}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
