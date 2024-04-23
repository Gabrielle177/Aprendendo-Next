"use client";
import { ReactNode, createContext, useContext, useState } from "react";

interface CartItem {
  productID: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productID: number) => void;
}

const CartContext = createContext({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(productID: number) {
    setCartItems((state) => {
      const productInCart = state.some((item) => item.productID == productID);

      if (productInCart) {
        return state.map((item) => {
          if (item.productID == productID) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      } else {
        return [...state, { productID, quantity: 1 }];
      }
    });
  }

  return (
    <CartContext.Provider value={{ items: cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
