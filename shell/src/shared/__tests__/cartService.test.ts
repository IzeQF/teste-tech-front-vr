import { syncCartWithApi } from "../cartService";
import { CartItem } from "../types";

const mockProduct = {
  id: 1,
  title: "Produto Teste",
  price: 99.9,
  thumbnail: "",
  images: [],
  description: "",
  category: "test",
  rating: 4.5,
  stock: 10,
};

const mockItems: CartItem[] = [
  { product: mockProduct, quantity: 2 },
];

const mockResponse = {
  id: 1,
  products: [{ id: 1, title: "Produto Teste", price: 99.9, quantity: 2, total: 199.8, discountPercentage: 0, discountedTotal: 199.8, thumbnail: "" }],
  total: 199.8,
  discountedTotal: 199.8,
  userId: 1,
  totalProducts: 1,
  totalQuantity: 2,
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("syncCartWithApi", () => {
  it("faz POST para /carts/add com payload correto", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await syncCartWithApi(mockItems, 1);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/carts/add",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, products: [{ id: 1, quantity: 2 }] }),
      })
    );
  });

  it("retorna a resposta da API corretamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await syncCartWithApi(mockItems);
    expect(result.totalQuantity).toBe(2);
    expect(result.userId).toBe(1);
  });

  it("usa userId padrão 1 quando não informado", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await syncCartWithApi(mockItems);

    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.userId).toBe(1);
  });

  it("lança erro quando a resposta não é ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(syncCartWithApi(mockItems)).rejects.toThrow(
      "Erro ao sincronizar carrinho: 500"
    );
  });

  it("envia carrinho vazio corretamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockResponse, totalQuantity: 0 }),
    });

    await syncCartWithApi([]);

    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.products).toEqual([]);
  });
});
