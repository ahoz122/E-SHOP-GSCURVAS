import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getProducts } from "../firebase/firestoreService";
import { Product, CartItem } from "../types/types";

interface VariantType {
  type: string;
  values: string[];
}

interface ShopState {
  products: Product[];
  cart: CartItem[];
  variantTypes: VariantType[];
  isLoading: boolean;
  error: string | null;
  lastProductsFetch: number | null;

  fetchProducts: () => Promise<void>;
  fetchVariantTypes: () => void; // Changed to sync function
  addToCart: (
    product: Product,
    quantity?: number,
    selectedVariants?: { [key: string]: string },
    price?: number,
    image?: string
  ) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  validateCart: () => void;
}

// One hour in milliseconds
const PRODUCTS_EXPIRATION_TIME = 0;

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      variantTypes: [],
      isLoading: false,
      error: null,
      lastProductsFetch: null,

      fetchProducts: async () => {
        const lastFetch = get().lastProductsFetch;
        const currentTime = Date.now();

        // Check if products need to be refreshed
        if (!lastFetch || currentTime - lastFetch > PRODUCTS_EXPIRATION_TIME) {
          set({ isLoading: true, error: null });
          try {
            const products = await getProducts();
            set({
              products,
              isLoading: false,
              lastProductsFetch: currentTime,
            });
            // Extract variant types after getting products
            get().fetchVariantTypes();
            // Validate cart after updating products
            get().validateCart();
          } catch (error) {
            console.error("Error fetching products:", error);
            set({ error: "Failed to fetch products", isLoading: false });
          }
        }
      },
      
      fetchVariantTypes: () => {
        // Extract variant types from products
        const { products } = get();
        const variantTypesMap: Record<string, Set<string>> = {};
        
        // Process all products to extract variant types
        products.forEach(product => {
          if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => {
              if (!variantTypesMap[variant.type]) {
                variantTypesMap[variant.type] = new Set<string>();
              }
              
              variantTypesMap[variant.type].add(variant.name);
            });
          }
        });
        
        // Convert to the expected format
        const variantTypes: VariantType[] = Object.entries(variantTypesMap).map(
          ([type, valuesSet]) => ({
            type,
            values: Array.from(valuesSet)
          })
        );
        
        set({ variantTypes });
      },

      validateCart: () => {
        const { cart, products } = get();

        const validatedCart = cart.filter((item) => {
          const productExists = products.some((p) => p.id === item.product.id);
          if (!productExists) {
            console.warn(
              `Product with ID ${item.product.id} no longer exists in the store.`
            );
            return false;
          }
          return true;
        });

        const updatedCart = validatedCart.map((item) => {
          const updatedProduct = products.find((p) => p.id === item.product.id);
          return {
            ...item,
            product: updatedProduct || item.product,
          };
        });

        set({ cart: updatedCart });
      },

      addToCart: (
        product, 
        quantity = 1, 
        selectedVariants = {}, 
        price, 
        image
      ) => {
        const { cart } = get();
        
        // Create details object from selected variants
        const details: { [key: string]: string } = {};
        Object.entries(selectedVariants).forEach(([type, variantName]) => {
          details[type] = variantName;
        });

        // Use either provided price or default product price
        const finalPrice = price || product.defaultPrice || 0;
        
        // Use either provided image or first product image or a placeholder
        const finalImage = image || (product.images && product.images.length > 0 ? product.images[0] : '');

        // Check if the exact same product with the same variants exists in the cart
        const existingItemIndex = cart.findIndex(
          (item) => 
            item.product.id === product.id &&
            JSON.stringify(item.details) === JSON.stringify(details)
        );

        if (existingItemIndex !== -1) {
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += quantity;
          set({ cart: updatedCart });
        } else {
          const id = Date.now();
          const newItem: CartItem = {
            id,
            product,
            quantity,
            image: finalImage,
            price: finalPrice,
            details,
          };
          set({ cart: [...cart, newItem] });
        }
      },

      removeFromCart: (itemId) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        const { cart } = get();
        set({
          cart: cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "shop-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        cart: state.cart,
        variantTypes: state.variantTypes,
        lastProductsFetch: state.lastProductsFetch,
      }),
    }
  )
);
