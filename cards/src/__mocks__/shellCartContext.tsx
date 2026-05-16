import React from "react";

export const useCart = jest.fn().mockReturnValue({
  items: [],
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  totalItems: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export default {};
