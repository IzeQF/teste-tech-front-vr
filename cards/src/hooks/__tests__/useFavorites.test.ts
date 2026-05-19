import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "../../hooks/useFavorites";

const STORAGE_KEY = "unistore_favorites";

beforeEach(() => {
  localStorage.clear();
});

describe("useFavorites", () => {
  it("inicia sem favoritos quando localStorage está vazio", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("adiciona um favorito ao chamar toggle", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(1));
    expect(result.current.isFavorite(1)).toBe(true);
  });

  it("remove um favorito ao chamar toggle novamente", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(1));
    act(() => result.current.toggle(1));
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("persiste favoritos no localStorage", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(42));
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    expect(stored).toContain(42);
  });

  it("carrega favoritos persistidos do localStorage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([7, 13]));
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite(7)).toBe(true);
    expect(result.current.isFavorite(13)).toBe(true);
    expect(result.current.isFavorite(99)).toBe(false);
  });

  it("ignora dado inválido no localStorage e inicia vazio", () => {
    localStorage.setItem(STORAGE_KEY, "invalid_json{{");
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("suporta múltiplos favoritos simultâneos", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(1));
    act(() => result.current.toggle(2));
    act(() => result.current.toggle(3));
    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(2)).toBe(true);
    expect(result.current.isFavorite(3)).toBe(true);
  });

  it("remover um favorito não afeta os outros", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggle(1));
    act(() => result.current.toggle(2));
    act(() => result.current.toggle(1));
    expect(result.current.isFavorite(1)).toBe(false);
    expect(result.current.isFavorite(2)).toBe(true);
  });
});
