import { renderHook, waitFor, act } from "@testing-library/react";
import useProducts from "../../hooks/useProducts";

const mockProducts = [
  { id: 1, title: "Produto 1", price: 10, thumbnail: "", images: [], description: "", category: "cat", rating: 4, stock: 5 },
  { id: 2, title: "Produto 2", price: 20, thumbnail: "", images: [], description: "", category: "cat", rating: 3, stock: 8 },
];

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("useProducts", () => {
  it("inicia com loading true e produtos vazios", () => {
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("carrega produtos com sucesso", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts, total: 80 }),
    });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toHaveLength(2);
    expect(result.current.products[0].title).toBe("Produto 1");
  });

  it("calcula totalPages corretamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts, total: 80 }),
    });

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.totalPages).toBe(2); // 80 / 40 = 2
  });

  it("define error quando a API falha", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Erro ao buscar produtos");
    expect(result.current.products).toEqual([]);
  });

  it("define error quando fetch rejeita", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Network error");
  });

  it("inicia na página 1", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts, total: 40 }),
    });

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.page).toBe(1);
  });

  it("busca com skip correto ao mudar de página", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts, total: 80 }),
    });

    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setPage(2);
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    const calls = (global.fetch as jest.Mock).mock.calls;
    expect(calls[1][0]).toContain("skip=40");
  });
});
