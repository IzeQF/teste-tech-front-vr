import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../Home";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("../../components/Carousel", () => {
  const MockCarousel = ({ title, loading }: { title: string; loading: boolean }) => (
    <div data-testid="carousel">
      <h2>{title}</h2>
      {loading && <span>Carregando...</span>}
    </div>
  );
  MockCarousel.displayName = "MockCarousel";
  return MockCarousel;
});

jest.mock("../../components/Hero", () => {
  const MockHero = () => <section data-testid="hero" />;
  MockHero.displayName = "MockHero";
  return MockHero;
});

const makeProduct = (id: number, discountPercentage: number) => ({
  id,
  title: `Produto ${id}`,
  price: 100,
  thumbnail: `https://example.com/${id}.jpg`,
  discountPercentage,
  images: [],
  description: "",
  category: "test",
  rating: 4,
  stock: 10,
});

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("Home", () => {
  it("renderiza o Hero", () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<Home />);
    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("renderiza os 6 carrosséis (1 desconto + 5 grupos)", () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<Home />);
    const carousels = screen.getAllByTestId("carousel");
    expect(carousels).toHaveLength(6);
  });

  it("exibe carrossel de Maiores Descontos", () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<Home />);
    expect(screen.getByText("🔥 Maiores Descontos")).toBeInTheDocument();
  });

  it("exibe todos os títulos de grupo", () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<Home />);
    expect(screen.getByText("👗 Moda & Acessórios")).toBeInTheDocument();
    expect(screen.getByText("📱 Tecnologia")).toBeInTheDocument();
    expect(screen.getByText("🏠 Casa & Decoração")).toBeInTheDocument();
    expect(screen.getByText("💄 Beleza & Cuidados")).toBeInTheDocument();
    expect(screen.getByText("🏋️ Esportes & Veículos")).toBeInTheDocument();
  });

  it("busca produtos com desconto", async () => {
    const allProducts = [
      makeProduct(1, 5),
      makeProduct(2, 30),
      makeProduct(3, 15),
      makeProduct(4, 0),
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ products: allProducts }) })
      .mockResolvedValue({ ok: true, json: async () => ({ products: [] }) });

    render(<Home />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("dummyjson.com/products?")
      );
    });
  });

  it("busca categorias de todos os grupos", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ products: [] }),
    });

    render(<Home />);

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls.map(([url]) => url as string);
      // Tecnologia
      expect(calls.some((u) => u.includes("/category/smartphones"))).toBe(true);
      expect(calls.some((u) => u.includes("/category/laptops"))).toBe(true);
      // Moda
      expect(calls.some((u) => u.includes("/category/mens-shirts"))).toBe(true);
      expect(calls.some((u) => u.includes("/category/womens-dresses"))).toBe(true);
      // Casa
      expect(calls.some((u) => u.includes("/category/furniture"))).toBe(true);
      // Beleza
      expect(calls.some((u) => u.includes("/category/beauty"))).toBe(true);
      // Esportes
      expect(calls.some((u) => u.includes("/category/sports-accessories"))).toBe(true);
    });
  });
});
