import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "../ProductCard";
import { useCart } from "shell/CartContext";

const mockUseCart = useCart as jest.Mock;

const mockProduct = {
  id: 1,
  title: "Batom Coral",
  price: 49.9,
  thumbnail: "https://example.com/img.jpg",
  description: "Batom de longa duração",
  category: "beleza",
  rating: 4.8,
  stock: 30,
};

const mockAddItem = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockUseCart.mockReturnValue({
    items: [],
    addItem: mockAddItem,
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    totalItems: 0,
  });
});

describe("ProductCard", () => {
  it("renderiza título e preço do produto", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Batom Coral")).toBeInTheDocument();
    expect(screen.getByText(/49[,.]90/)).toBeInTheDocument();
  });

  it("exibe botão 'Adicionar' quando produto não está no carrinho", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole("button", { name: /adicionar/i })).toBeInTheDocument();
  });

  it("exibe quantidade no botão quando produto está no carrinho", () => {
    mockUseCart.mockReturnValue({
      items: [{ product: mockProduct, quantity: 2 }],
      addItem: mockAddItem,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      totalItems: 2,
    });
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByRole("button", { name: /adicionado \(2\)/i })).toBeInTheDocument();
  });

  it("chama addItem ao clicar no botão", () => {
    render(<ProductCard product={mockProduct} />);
    fireEvent.click(screen.getByRole("button", { name: /adicionar/i }));
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
    expect(mockAddItem).toHaveBeenCalledTimes(1);
  });
});
