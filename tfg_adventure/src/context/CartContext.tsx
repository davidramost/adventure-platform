import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Producto } from '../types';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (producto: Producto, cantidad: number) => void;
  removeFromCart: (id_producto: number) => void;
  updateQuantity: (id_producto: number, cantidad: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (producto: Producto, cantidad: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.producto.id_producto === producto.id_producto);
      if (existingItem) {
        return prevCart.map(item =>
          item.producto.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prevCart, { producto, cantidad }];
    });
  };

  const removeFromCart = (id_producto: number) => {
    setCart(prevCart => prevCart.filter(item => item.producto.id_producto !== id_producto));
  };

  const updateQuantity = (id_producto: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(id_producto);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.producto.id_producto === id_producto
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
