import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../shared/CartContext";
import { Product } from "../shared/types";
import "./ProductDetail.css";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, updateQuantity, items } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const cartItem = items.find((i) => i.product.id === product?.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Produto não encontrado");
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [id]);

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <span className="detail__stars" aria-label={`Avaliação: ${rating.toFixed(1)} de 5`}>
        <span aria-hidden="true">
          {"★".repeat(full)}
          {half ? "½" : ""}
          {"☆".repeat(5 - full - (half ? 1 : 0))}
        </span>
        <span className="detail__rating-value" aria-hidden="true"> {rating.toFixed(1)}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <main className="detail__state">
        <p role="status" aria-live="polite">Carregando produto...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="detail__state">
        <p role="alert">{error || "Produto não encontrado."}</p>
        <button className="detail__back-btn" onClick={() => navigate("/")}>
          ← Voltar
        </button>
      </main>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const discountedPrice =
    product.discountPercentage
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  return (
    <main className="detail">
      <button className="detail__back-btn" onClick={() => navigate("/")}>
        ← Voltar para produtos
      </button>

      <div className="detail__layout">
        <div className="detail__gallery">
          <img
            className="detail__main-image"
            src={images[activeImage]}
            alt={product.title}
          />
          {images.length > 1 && (
            <div className="detail__thumbnails" role="group" aria-label="Miniaturas do produto">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`detail__thumb-btn${activeImage === i ? " detail__thumb-btn--active" : ""}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Ver imagem ${i + 1} de ${images.length}`}
                  aria-pressed={activeImage === i}
                >
                  <img src={img} alt="" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail__info">
          {product.brand && (
            <span className="detail__brand">{product.brand}</span>
          )}
          <h1 className="detail__title">{product.title}</h1>

          <div className="detail__rating-row">
            {renderStars(product.rating)}
            {product.reviews && (
              <span className="detail__review-count">
                ({product.reviews.length} avaliações)
              </span>
            )}
          </div>

          <div className="detail__price-block">
            {discountedPrice ? (
              <>
                <span className="detail__price-original" aria-label={`Preço original: ${formatPrice(product.price)}`}>
                  {formatPrice(product.price)}
                </span>
                <span className="detail__price" aria-label={`Preço com desconto: ${formatPrice(discountedPrice)}`}>
                  {formatPrice(discountedPrice)}
                </span>
                <span className="detail__discount" aria-label={`Desconto de ${product.discountPercentage!.toFixed(0)}%`}>
                  -{product.discountPercentage!.toFixed(0)}%
                </span>
              </>
            ) : (
              <span className="detail__price">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="detail__description">{product.description}</p>

          <div className="detail__meta">
            {product.availabilityStatus && (
              <span className={`detail__badge detail__badge--${product.stock > 0 ? "in" : "out"}`}>
                {product.availabilityStatus}
              </span>
            )}
            {product.tags?.map((tag) => (
              <span key={tag} className="detail__tag">{tag}</span>
            ))}
          </div>

          <div className="detail__cart-section">
            {quantity === 0 ? (
              <button
                className="detail__add-btn"
                onClick={() => addItem(product)}
                disabled={product.stock === 0}
              >
                Adicionar ao carrinho
              </button>
            ) : (
              <>
                <div className="detail__qty-controls">
                  <button
                    className="detail__qty-btn"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    aria-label="Diminuir quantidade"
                  >−</button>
                  <span className="detail__qty-value" aria-live="polite" aria-atomic="true" aria-label={`Quantidade: ${quantity}`}>{quantity}</span>
                  <button
                    className="detail__qty-btn"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label="Aumentar quantidade"
                    disabled={quantity >= product.stock}
                  >+</button>
                  <span className="detail__qty-label">no carrinho ✓</span>
                </div>
                {quantity >= product.stock && (
                  <p className="detail__stock-limit" role="alert">Limite de estoque atingido ({product.stock} un.)</p>
                )}
              </>
            )}
          </div>

          <div className="detail__extra">
            {product.warrantyInformation && (
              <div className="detail__extra-item">
                <span className="detail__extra-label">Garantia</span>
                <span>{product.warrantyInformation}</span>
              </div>
            )}
            {product.shippingInformation && (
              <div className="detail__extra-item">
                <span className="detail__extra-label">Envio</span>
                <span>{product.shippingInformation}</span>
              </div>
            )}
            {product.returnPolicy && (
              <div className="detail__extra-item">
                <span className="detail__extra-label">Devolução</span>
                <span>{product.returnPolicy}</span>
              </div>
            )}
            {product.weight !== undefined && (
              <div className="detail__extra-item">
                <span className="detail__extra-label">Peso</span>
                <span>{product.weight} kg</span>
              </div>
            )}
            {product.dimensions && (
              <div className="detail__extra-item">
                <span className="detail__extra-label">Dimensões</span>
                <span>
                  {product.dimensions.width.toFixed(2)} × {product.dimensions.height.toFixed(2)} × {product.dimensions.depth.toFixed(2)} cm
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="detail__reviews">
          <h2 className="detail__reviews-title">Avaliações dos clientes</h2>
          <div className="detail__reviews-list">
            {product.reviews.map((review, i) => (
              <article key={i} className="detail__review-card" aria-label={`Avaliação de ${review.reviewerName}`}>
                <div className="detail__review-header">
                  <span className="detail__reviewer">{review.reviewerName}</span>
                  <span
                    className="detail__review-stars"
                    aria-label={`${review.rating} de 5 estrelas`}
                  >
                    <span aria-hidden="true">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  </span>
                </div>
                <p className="detail__review-comment">{review.comment}</p>
                <time className="detail__review-date" dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString("pt-BR")}
                </time>
              </article>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetail;
