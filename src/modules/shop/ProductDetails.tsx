import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { FiShoppingCart } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Product, Variant } from "../../types/types";
import { getWhatsAppLink } from "../../utils/whatsappUtils";
import { motion } from "framer-motion";
import { useShopStore } from "../../stores/shopStore";
import { getProductById } from "../../firebase/firestoreService";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { products, fetchProducts } = useShopStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variantsByType, setVariantsByType] = useState<
    Record<string, Variant[]>
  >({});
  const [selectedVariants, setSelectedVariants] = useState<{
    [type: string]: string;
  }>({});
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(
    undefined
  );
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();

    // If we have the id, try to get the product directly
    if (id) {
      const loadProduct = async () => {
        const product = await getProductById(id);
        if (product) {
          console.log("Product found", product);
          setSelectedProduct(product);
        }
      };
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    // Find the selected product from store if not already loaded
    if (!selectedProduct) {
      const product = products.find((p) => p.id === id);
      if (product) {
        setSelectedProduct(product);
      }
    }

    // Process the product once we have it
    if (selectedProduct) {
      setSelectedPrice(selectedProduct.defaultPrice);
      setSelectedImage(selectedProduct.images?.[0]);
      document.title = selectedProduct.name + " - LUXPHES";

      // Group variants by type
      const variantGroups: Record<string, Variant[]> = {};

      // Collect all images (product images and variant images)
      const productImages = selectedProduct.images || [];
      const variantImages: string[] = [];

      if (selectedProduct.variants?.length) {
        selectedProduct.variants.forEach((variant) => {
          if (!variantGroups[variant.type]) {
            variantGroups[variant.type] = [];
          }
          variantGroups[variant.type].push(variant);

          // Add variant image if it exists and isn't already in the images array
          if (
            variant.image &&
            !productImages.includes(variant.image) &&
            !variantImages.includes(variant.image)
          ) {
            variantImages.push(variant.image);
          }
        });
      }

      setAllImages([...productImages, ...variantImages]);
      setVariantsByType(variantGroups);

      // Select first variant of each type by default
      const initialSelectedVariants: { [type: string]: string } = {};
      Object.entries(variantGroups).forEach(([type, variants]) => {
        if (variants.length > 0) {
          initialSelectedVariants[type] = variants[0].name;
        }
      });
      setSelectedVariants(initialSelectedVariants);
    }
  }, [id, products, selectedProduct]);

  // Add a new useEffect to handle initial variant selection
  useEffect(() => {
    if (Object.keys(variantsByType).length > 0 && selectedProduct) {
      // Apply the effect of selecting the first variant
      Object.entries(variantsByType).forEach(([type, variants]) => {
        if (
          variants.length > 0 &&
          (!selectedVariants[type] ||
            selectedVariants[type] === variants[0].name)
        ) {
          handleVariantChange(type, variants[0].name);
        }
      });
    }
  }, [variantsByType, selectedProduct]);

  const handleVariantChange = (type: string, variantName: string) => {
    const newSelectedVariants = { ...selectedVariants };
    newSelectedVariants[type] = variantName;
    setSelectedVariants(newSelectedVariants);

    // Find the selected variant
    const variant = variantsByType[type]?.find((v) => v.name === variantName);

    // Update price if variant has a price
    if (variant?.price) {
      setSelectedPrice(Number(variant.price));
    }

    // Update image if variant has an image
    if (variant?.image) {
      setSelectedImage(variant.image);
      // Update current image index if the image exists in allImages
      const imageIndex = allImages.findIndex((img) => img === variant.image);
      if (imageIndex !== -1) {
        setCurrentImageIndex(imageIndex);
      }
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      // Get the addToCart function from the store
      const { addToCart } = useShopStore.getState();

      // Call addToCart with the proper parameters
      addToCart(
        selectedProduct,
        1, // quantity
        selectedVariants,
        selectedPrice || selectedProduct.defaultPrice,
        selectedImage || selectedProduct.images?.[0] || ""
      );
    }
  };

  const handleImageChange = (index: number) => {
    if (allImages && allImages[index]) {
      setCurrentImageIndex(index);
      setSelectedImage(allImages[index]);
    }
  };

  const currentPrice = selectedPrice || selectedProduct?.defaultPrice || 0;

  const handleWhatsappClick = () => {
    if (!selectedProduct) return;

    let message = `¡Hola! Estoy interesado en el producto ${selectedProduct.name}`;

    // Add selected variant details
    if (Object.keys(selectedVariants).length > 0) {
      message += " con las siguientes características: ";

      for (const [type, variantName] of Object.entries(selectedVariants)) {
        message += `${type}: ${variantName}, `;
      }

      message = message.slice(0, -2); // Remove last comma and space
    }

    message += `. Precio: $${currentPrice}`;

    const whatsappLink = getWhatsAppLink("593982891603", message);
    window.open(whatsappLink, "_blank");
  };

  if (!selectedProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando producto...
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col h-[100dvh]" // Use dynamic viewport height and ensure full height
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex-1 p-3 overflow-y-auto pt-20 pb-24" // Add padding bottom to account for bottom bar
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row md:gap-5">
          <div className="w-full md:w-1/2 md:mb-0">
            {/* Full screen overlay */}
            {selectedImage && (
              <>
                <motion.img
                  alt={selectedProduct.name || "Imagen del producto"}
                  src={
                    selectedImage ||
                    selectedProduct.images?.[0] ||
                    "https://www.creativefabrica.com/wp-content/uploads/2021/04/05/Photo-Image-Icon-Graphics-10388619-1.jpg"
                  }
                  className="w-full cursor-pointer"
                  style={{ height: "25vh", objectFit: "contain" }}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    const modal = document.getElementById("imageModal");
                    if (modal) modal.style.display = "flex";
                  }}
                />

                {/* Full screen modal */}
                <div
                  id="imageModal"
                  className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 hidden justify-center items-center"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      const modal = document.getElementById("imageModal");
                      if (modal) modal.style.display = "none";
                    }
                  }}
                >
                  <div className="relative max-w-[90%] max-h-[90%]">
                    <div
                      id="imageContainer"
                      className="relative transition-transform duration-300"
                      style={{ transformOrigin: "0 0" }}
                      data-original-origin="center center"
                    >
                      <img
                        id="zoomableImage"
                        src={selectedImage}
                        alt={
                          selectedProduct.name || "Imagen en pantalla completa"
                        }
                        className="max-w-full max-h-[90vh] object-contain"
                        style={{ cursor: "zoom-in" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const container =
                            document.getElementById("imageContainer");
                          const image = e.currentTarget;
                          const isZoomed =
                            container?.style.transform.includes("scale(2)");

                          if (isZoomed) {
                            // Reset zoom using the same origin point for a smooth transition
                            container!.style.transform = "scale(1)";
                            image.style.cursor = "zoom-in";
                          } else {
                            // Calculate relative position within the image
                            const rect = image.getBoundingClientRect();
                            const offsetX =
                              (e.clientX - rect.left) / rect.width;
                            const offsetY =
                              (e.clientY - rect.top) / rect.height;

                            // Store and set the transform origin to the click position
                            const originValue = `${offsetX * 100}% ${
                              offsetY * 100
                            }%`;
                            container!.dataset.originalOrigin = originValue;
                            container!.style.transformOrigin = originValue;
                            container!.style.transform = "scale(2)";
                            image.style.cursor = "zoom-out";
                          }
                        }}
                      />
                      <button
                        className="absolute top-2 right-2 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-50 transition-all"
                        style={{
                          background: "rgba(0, 0, 0, 0.5)",
                          backdropFilter: "blur(2px)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const modal = document.getElementById("imageModal");
                          const container =
                            document.getElementById("imageContainer");
                          if (container) container.style.transform = "scale(1)";
                          if (modal) modal.style.display = "none";
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Thumbnails - now showing both product and variant images */}
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`cursor-pointer border-2 ${
                      idx === currentImageIndex
                        ? "border-primary"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleImageChange(idx)}
                  >
                    <img
                      src={img}
                      alt={`${selectedProduct.name} - imagen ${idx + 1}`}
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <motion.div
            className="mt-4 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold m-0">{selectedProduct.name}</h2>
              <motion.span
                className="font-bold text-primary text-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                $
                {currentPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </motion.span>
            </div>
            {selectedProduct.brand && (
              <h3 className="text-xl font-semibold text-gray-600">
                By {selectedProduct.brand}
              </h3>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="mt-4">Descripción</h3>
              <p className="text-gray-600">{selectedProduct.description}</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] bg-white fixed bottom-0 left-0 right-0 z-10" 
        // Changed from sticky to fixed for better mobile support
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {Object.keys(variantsByType).length > 0 && (
          <div
            style={{
              border: "1px solid #eaeaea",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              marginBottom: "0.75rem",
              backgroundColor: "white",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {Object.entries(variantsByType).map(([type, variants]) => (
                <div
                  key={type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      minWidth: "60px",
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}:
                  </span>
                  {variants && variants.length > 0 ? (
                    <Dropdown
                      value={selectedVariants[type]}
                      onChange={(e) => handleVariantChange(type, e.value)}
                      options={variants.map((v) => v.name)}
                      placeholder="Select"
                      style={{
                        height: "2rem",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                      panelStyle={{ fontSize: "0.875rem" }}
                      className="w-full"
                    />
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      No options
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <motion.div
            className="w-1/2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              variant="primary"
              onClick={handleWhatsappClick}
              icon={<FaWhatsapp />}
              className="w-full py-3"
            >
              <span className="font-bold whitespace-nowrap">Comprar ahora</span>
            </Button>
          </motion.div>
          <motion.div
            className="w-1/2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button
              variant="black"
              onClick={handleAddToCart}
              icon={<FiShoppingCart />}
              className="w-full py-3"
            >
              <span className="font-bold whitespace-nowrap">
                Añadir al carrito
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
