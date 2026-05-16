import React from "react";
import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CartProvider, useCart } from "../CartContext";
import { Product } from "../types";

const mockProduct: Product = {
  id: 1,
  title: "Produto Teste",
  price: 99.99,
  thumbnail: "https://example.com/img.jpg",
  description: "Descrição teste",
  category: "teste",
  rating: 4.5,
  stock: 10,
};

const mockProduct2: Product = {
  ...mockProduct,
  id: 2,
  title: "Produto Teste 2",
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  it("inicia com carrinho vazio", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("addItem adiciona um novo produto ao carrinho", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addItem(mockProduct); });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(1);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it("addItem incrementa quantidade quando produto já existe", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addItem(mockProduct); });
    act(() => { result.current.addItem(mockProduct); });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it("removeItem remove o produto do carrinho", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addItem(mockProduct); });
    act(() => { result.current.removeItem(1); });
    expect(result.current.items).toHaveLength(0);
  });

  it("updateQuantity atualiza a quantidade corretamente", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addItem(mockProduct); });
    act(() => { result.current.updateQuantity(1, 5); });
    expect(result.current.items[0].quantity).toBe(5);
  });

  it("updateQuantity com 0 remove o produto", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addItem(mockProduct); });
    act(() => { result.current.updateQuantity(1, 0); });
    expect(result.current.items).toHaveLength(0);
  });

  it("clearCart esvazia o carrinho", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addItem(mockProduct); });
    act(() => { result.current.addItem(mockProduct2); });
    act(() => { result.current.clearCart(); });
    expect(result.current.items).toHaveLength(0);
  });

  it("totalItems retorna a soma de todas as quantidades", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => { result.current.addItem(mockProduct); });
    act(() => { result.current.addItem(mockProduct); });
    act(() => { result.current.addItem(mockProduct2); });
    expect(result.current.totalItems).toBe(3);
  });

  it("useCart lança erro quando usado fora do CartProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart deve ser usado dentro de CartProvider"
    );
    consoleError.mockRestore();
  });
});
