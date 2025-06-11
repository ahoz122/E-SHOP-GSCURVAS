import { create } from 'zustand';
import { Product } from '../types/product';

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  sendToWhatsApp: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (product: Product, size: string, color: string) => {
    const items = get().items;
    const existingItem = items.find(
      item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
    );

    if (existingItem) {
      set({
        items: items.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [...items, { ...product, quantity: 1, selectedSize: size, selectedColor: color }],
      });
    }
  },

  removeItem: (productId: string) => {
    set({
      items: get().items.filter(item => item.id !== productId),
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    set({
      items: get().items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  sendToWhatsApp: () => {
    const items = get().items;
    const phoneNumber = '593982891603'; // Número de WhatsApp actualizado
    
    let message = '¡Hola! Me gustaría hacer un pedido:\n\n';
    
    items.forEach(item => {
      message += `▪️ ${item.name}\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Talla: ${item.selectedSize}\n`;
      message += `   - Color: ${item.selectedColor}\n`;
      message += `   - Precio: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: $${total.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  },
})); 