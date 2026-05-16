import React from "react";
import useProducts from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import "./Cards.css";

const Cards: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <section className="cards-grid">
        <p className="cards-grid__loading">Carregando produtos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="cards-grid">
        <p className="cards-grid__error">Erro ao carregar produtos: {error}</p>
      </section>
    );
  }

  return (
    <section className="cards-grid">
      <h2 className="cards-grid__title">Nossos Produtos</h2>
      <div className="cards-grid__list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Cards;
