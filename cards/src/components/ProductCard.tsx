import React from "react";
import { Product } from "shell/types";
import { useCart } from "shell/CartContext";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { addItem, items } = useCart();

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCardClick = () => {
    window.location.href = `/product/${product.id}`;
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${product.title}, ${formatPrice(product.price)}`}
      style={{ cursor: "pointer" }}
    >
      <div className="product-card__image-wrapper">
        <img
          className="product-card__image"
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
        />
        {onToggleFavorite && (
          <button
            className={`product-card__favorite${isFavorite ? " product-card__favorite--active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <span className="product-card__price">{formatPrice(product.price)}</span>
        {quantity > 0 && quantity >= product.stock && (
          <span className="product-card__stock-limit" role="status">Estoque máximo atingido</span>
        )}
        <button
          className={`product-card__button${quantity > 0 ? " product-card__button--added" : ""}`}
          onClick={handleAddClick}
          disabled={quantity >= product.stock}
          title={quantity >= product.stock ? `Estoque máximo: ${product.stock} un.` : undefined}
        >
          {quantity >= product.stock
            ? `Máximo (${product.stock}) ✓`
            : quantity > 0
            ? `Adicionado (${quantity}) ✓`
            : "Adicionar"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
