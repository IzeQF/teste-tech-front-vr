import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Carousel from "../Carousel";

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockNavigate = jest.fn();

const mockProducts = [
  {
    id: 1,
    title: "Smartphone X",
    price: 1999.9,
    thumbnail: "https://example.com/img1.jpg",
    discountPercentage: 25,
    images: [],
    description: "",
    category: "smartphones",
    rating: 4.5,
    stock: 10,
  },
  {
    id: 2,
    title: "Laptop Pro",
    price: 4999.9,
    thumbnail: "https://example.com/img2.jpg",
    discountPercentage: 0,
    images: [],
    description: "",
    category: "laptops",
    rating: 4.8,
    stock: 5,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Carousel", () => {
  it("renderiza o título do carrossel", () => {
    render(<Carousel title="Maiores Descontos" products={mockProducts} />);
    expect(screen.getByText("Maiores Descontos")).toBeInTheDocument();
  });

  it("renderiza os cards de produtos", () => {
    render(<Carousel title="Tech" products={mockProducts} />);
    expect(screen.getByText("Smartphone X")).toBeInTheDocument();
    expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
  });

  it("exibe badge de desconto apenas quando discountPercentage > 0", () => {
    render(<Carousel title="Tech" products={mockProducts} />);
    expect(screen.getByText("-25%")).toBeInTheDocument();
    expect(screen.queryByText("-0%")).not.toBeInTheDocument();
  });

  it("navega para /produto/:id ao clicar no card", () => {
    render(<Carousel title="Tech" products={mockProducts} />);
    fireEvent.click(screen.getByLabelText(/Smartphone X/i));
    expect(mockNavigate).toHaveBeenCalledWith("/produto/1");
  });

  it("navega ao pressionar Enter no card", () => {
    render(<Carousel title="Tech" products={mockProducts} />);
    const card = screen.getByLabelText(/Laptop Pro/i);
    fireEvent.keyDown(card, { key: "Enter" });
    expect(mockNavigate).toHaveBeenCalledWith("/produto/2");
  });

  it("exibe skeleton de loading quando loading=true", () => {
    render(<Carousel title="Tech" products={[]} loading={true} />);
    expect(screen.getByRole("status", { name: /carregando produtos/i })).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("exibe botões de navegação esquerda e direita", () => {
    render(<Carousel title="Tech" products={mockProducts} />);
    expect(screen.getByRole("button", { name: /rolar para a esquerda/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rolar para a direita/i })).toBeInTheDocument();
  });

  it("botões de seta chamam scrollBy no track", () => {
    const scrollByMock = jest.fn();
    render(<Carousel title="Tech" products={mockProducts} />);
    const track = document.querySelector(".carousel__track") as HTMLElement;
    track.scrollBy = scrollByMock;
    fireEvent.click(screen.getByRole("button", { name: /rolar para a direita/i }));
    expect(scrollByMock).toHaveBeenCalledWith({ left: 300, behavior: "smooth" });
  });
});
