import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductDetail from "../ProductDetail";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
  useNavigate: () => mockNavigate,
}));

// Mock CartContext
jest.mock("../../shared/CartContext", () => ({
  useCart: () => ({
    items: [],
    addItem: mockAddItem,
    updateQuantity: mockUpdateQuantity,
    removeItem: jest.fn(),
    clearCart: jest.fn(),
    totalItems: 0,
    isSyncing: false,
  }),
}));

const mockNavigate = jest.fn();
const mockAddItem = jest.fn();
const mockUpdateQuantity = jest.fn();

const mockProduct = {
  id: 1,
  title: "Notebook Pro",
  price: 2999.9,
  thumbnail: "https://example.com/img.jpg",
  images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  description: "Notebook de alta performance",
  category: "laptops",
  rating: 4.8,
  stock: 15,
  brand: "TechBrand",
  discountPercentage: 10,
  warrantyInformation: "1 ano de garantia",
  shippingInformation: "Entrega em 3 dias",
  returnPolicy: "30 dias para devolução",
  weight: 1.5,
  dimensions: { width: 35.0, height: 1.8, depth: 24.0 },
  availabilityStatus: "In Stock",
  tags: ["notebook", "tech"],
  reviews: [
    { rating: 5, comment: "Excelente!", date: "2024-01-15T00:00:00.000Z", reviewerName: "João Silva" },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("ProductDetail", () => {
  it("exibe estado de carregamento inicialmente", () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<ProductDetail />);
    expect(screen.getByText(/carregando produto/i)).toBeInTheDocument();
  });

  it("exibe os dados do produto após carregar", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    render(<ProductDetail />);
    await waitFor(() => expect(screen.getByText("Notebook Pro")).toBeInTheDocument());
    expect(screen.getByText("TechBrand")).toBeInTheDocument();
    expect(screen.getByText("Notebook de alta performance")).toBeInTheDocument();
  });

  it("exibe mensagem de erro quando API falha", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    render(<ProductDetail />);
    await waitFor(() => expect(screen.getByText(/produto não encontrado/i)).toBeInTheDocument());
  });

  it("exibe informações extras: garantia, envio, dimensões", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    render(<ProductDetail />);
    await waitFor(() => screen.getByText("Notebook Pro"));
    expect(screen.getByText("1 ano de garantia")).toBeInTheDocument();
    expect(screen.getByText("Entrega em 3 dias")).toBeInTheDocument();
    expect(screen.getByText(/1\.5 kg/)).toBeInTheDocument();
  });

  it("exibe avaliações dos clientes", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    render(<ProductDetail />);
    await waitFor(() => screen.getByText("Avaliações dos clientes"));
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Excelente!")).toBeInTheDocument();
  });

  it("chama addItem ao clicar em Adicionar ao carrinho", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    render(<ProductDetail />);
    await waitFor(() => screen.getByText("Notebook Pro"));
    fireEvent.click(screen.getByRole("button", { name: /adicionar ao carrinho/i }));
    expect(mockAddItem).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  it("chama navigate ao clicar em voltar", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    render(<ProductDetail />);
    await waitFor(() => screen.getByText("Notebook Pro"));
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("troca a imagem principal ao clicar em thumbnail", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    render(<ProductDetail />);
    await waitFor(() => screen.getByText("Notebook Pro"));

    const thumbBtns = screen.getAllByRole("button", { name: /ver imagem/i });
    expect(thumbBtns.length).toBe(2);
    fireEvent.click(thumbBtns[1]);
    const mainImg = screen.getByRole("img", { name: "Notebook Pro" });
    expect(mainImg).toHaveAttribute("src", mockProduct.images[1]);
  });
});
