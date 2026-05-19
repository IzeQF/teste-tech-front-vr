import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../Header";
import { useCart } from "shell/CartContext";

const mockUseCart = useCart as jest.Mock;

const mockProduct = {
  id: 1,
  title: "Creme Hidratante",
  price: 79.9,
  thumbnail: "https://example.com/img.jpg",
  description: "Hidratação profunda",
  category: "skincare",
  rating: 4.7,
  stock: 20,
};

const mockClearCart = jest.fn();
const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockUseCart.mockReturnValue({
    items: [],
    addItem: jest.fn(),
    removeItem: mockRemoveItem,
    updateQuantity: mockUpdateQuantity,
    clearCart: mockClearCart,
    totalItems: 0,
  });
});

describe("Header", () => {
  it("renderiza o logo UniStore", () => {
    render(<Header />);
    expect(screen.getByText("UniStore")).toBeInTheDocument();
  });

  it("renderiza o botão de abrir carrinho", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /abrir carrinho/i })).toBeInTheDocument();
  });

  it("não exibe badge quando carrinho está vazio", () => {
    render(<Header />);
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it("exibe badge com totalItems quando carrinho tem itens", () => {
    mockUseCart.mockReturnValue({
      items: [{ product: mockProduct, quantity: 3 }],
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
      totalItems: 3,
    });
    render(<Header />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("abre o modal do carrinho ao clicar no botão", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /abrir carrinho/i }));
    expect(screen.getByRole("dialog", { name: /carrinho/i })).toBeInTheDocument();
  });

  it("exibe mensagem de carrinho vazio quando não há itens", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /abrir carrinho/i }));
    expect(screen.getByText(/carrinho está vazio/i)).toBeInTheDocument();
  });

  it("exibe produtos no modal quando há itens no carrinho", () => {
    mockUseCart.mockReturnValue({
      items: [{ product: mockProduct, quantity: 1 }],
      addItem: jest.fn(),
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
      totalItems: 1,
    });
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /abrir carrinho/i }));
    expect(screen.getByText("Creme Hidratante")).toBeInTheDocument();
  });

  it("fecha o modal ao clicar no botão de fechar", () => {
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: /abrir carrinho/i }));
    fireEvent.click(screen.getByRole("button", { name: /fechar carrinho/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
