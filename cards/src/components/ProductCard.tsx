import React from "react";
import { Product } from "shell/types";
import { useCart } from "shell/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCart();

  const isInCart = items.some((i) => i.product.id === product.id);

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <article className="product-card">
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
          className={`product-card__button${isInCart ? " product-card__button--added" : ""}`}
          onClick={() => addItem(product)}
        >
          {isInCart ? "Adicionado ✓" : "Adicionar"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
