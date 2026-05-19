import { useState, useEffect } from "react";
import { Product } from "shell/types";

const PAGE_SIZE = 40;

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const skip = (page - 1) * PAGE_SIZE;
    fetch(`https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return { products, loading, error, page, totalPages, setPage };
};

export default useProducts;
