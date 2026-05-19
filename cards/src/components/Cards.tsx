import React, { useMemo, useState } from "react";
import useProducts from "../hooks/useProducts";
import { useFavorites } from "../hooks/useFavorites";
import ProductCard from "./ProductCard";
import "./Cards.css";

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "rating-asc"
  | "name-asc";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Padrão",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
  "rating-desc": "Melhor avaliação",
  "rating-asc": "Menor avaliação",
  "name-asc": "Nome A–Z",
};

const Cards: React.FC = () => {
  const { products, loading, error, page, totalPages, setPage } = useProducts();
  const { isFavorite, toggle } = useFavorites();

  const [sort, setSort] = useState<SortOption>("default");
  const [category, setCategory] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (onlyFavorites) {
      list = list.filter((p) => isFavorite(p.id));
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        list.sort((a, b) => a.rating - b.rating);
        break;
      case "name-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return list;
  }, [products, sort, category, onlyFavorites, isFavorite]);

  if (loading) {
    return (
      <section className="cards-grid">
        <p className="cards-grid__loading" role="status" aria-live="polite">Carregando produtos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="cards-grid">
        <p className="cards-grid__error" role="alert">Erro ao carregar produtos: {error}</p>
      </section>
    );
  }

  return (
    <section className="cards-grid">
      <h2 className="cards-grid__title">Nossos Produtos</h2>

      <div className="cards-filters">
        <select
          className="cards-filters__select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filtrar por categoria"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Todas as categorias" : cat}
            </option>
          ))}
        </select>

        <select
          className="cards-filters__select"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Ordenar por"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>

        <button
          className={`cards-filters__favorites-btn${onlyFavorites ? " cards-filters__favorites-btn--active" : ""}`}
          onClick={() => setOnlyFavorites((v) => !v)}
          aria-pressed={onlyFavorites}
        >
          {onlyFavorites ? "♥ Favoritos" : "♡ Favoritos"}
        </button>

        <span className="cards-filters__count" aria-live="polite" aria-atomic="true">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="cards-grid__empty">Nenhum produto encontrado.</p>
      ) : (
        <div className="cards-grid__list">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={isFavorite(product.id)}
              onToggleFavorite={toggle}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="cards-pagination" aria-label="Paginação de produtos">
          <button
            className="cards-pagination__btn"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`cards-pagination__btn${p === page ? " cards-pagination__btn--active" : ""}`}
              onClick={() => handlePageChange(p)}
              aria-label={`Página ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ))}

          <button
            className="cards-pagination__btn"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Próxima página"
          >
            ›
          </button>
        </nav>
      )}
    </section>
  );
};

export default Cards;
