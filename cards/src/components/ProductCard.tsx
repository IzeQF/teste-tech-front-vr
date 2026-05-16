import React from "react";
import { Product } from "shell/types";
import { useCart } from "shell/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <img
        className="product-card__image"
        src={product.thumbnail}
        alt={product.title}
        loading="lazy"
      />
      <div className="product-card__body">
        <h3 className="product-card__title">{product.title}</h3>
        <span className="product-card__price">{formatPrice(product.price)}</span>
        <button
          className={`product-card__button${quantity > 0 ? " product-card__button--added" : ""}`}
          onClick={handleAddClick}
        >
          {quantity > 0 ? `Adicionado (${quantity}) ✓` : "Adicionar"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
