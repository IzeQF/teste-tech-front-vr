import React, { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../shared/types";
import "./Carousel.css";

interface CarouselProps {
  title: string;
  products: Product[];
  loading?: boolean;
}

const SCROLL_AMOUNT = 300;

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Carousel: React.FC<CarouselProps> = ({ title, products, loading = false }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollLeft = useCallback(() => {
    trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  }, []);

  return (
    <section className="carousel" aria-label={title}>
      <div className="carousel__header">
        <h2 className="carousel__title">{title}</h2>
        <div className="carousel__controls">
          <button
            className="carousel__arrow"
            onClick={scrollLeft}
            aria-label="Rolar para a esquerda"
          >
            ‹
          </button>
          <button
            className="carousel__arrow"
            onClick={scrollRight}
            aria-label="Rolar para a direita"
          >
            ›
          </button>
        </div>
      </div>

      {loading ? (
        <div className="carousel__skeleton" role="status" aria-label="Carregando produtos">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="carousel__skeleton-card" aria-hidden="true" />
          ))}
        </div>
      ) : (
        <div className="carousel__track" ref={trackRef} role="list">
          {products.map((product) => (
            <article
              key={product.id}
              className="carousel__card"
              role="listitem"
              onClick={() => navigate(`/produto/${product.id}`)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/produto/${product.id}`)}
              aria-label={`${product.title}, ${formatPrice(product.price)}`}
            >
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="carousel__badge" aria-label={`${Math.round(product.discountPercentage)}% de desconto`}>
                  -{Math.round(product.discountPercentage)}%
                </span>
              )}
              <img
                className="carousel__card-img"
                src={product.thumbnail}
                alt={product.title}
                loading="lazy"
              />
              <div className="carousel__card-body">
                <p className="carousel__card-title">{product.title}</p>
                <p className="carousel__card-price">{formatPrice(product.price)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Carousel;
