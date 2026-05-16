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
      <span className="detail__stars" title={`${rating.toFixed(1)} de 5`}>
        {"★".repeat(full)}
        {half ? "½" : ""}
        {"☆".repeat(5 - full - (half ? 1 : 0))}
        <span className="detail__rating-value"> {rating.toFixed(1)}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="detail__state">
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail__state">
        <p>{error || "Produto não encontrado."}</p>
        <button className="detail__back-btn" onClick={() => navigate("/")}>
          ← Voltar
        </button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.thumbnail];
  const discountedPrice =
    product.discountPercentage
      ? product.price * (1 - product.discountPercentage / 100)
      : null;

  return (
    <div className="detail">
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
            <div className="detail__thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`detail__thumb-btn${activeImage === i ? " detail__thumb-btn--active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} />
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
                <span className="detail__price-original">
                  {formatPrice(product.price)}
                </span>
                <span className="detail__price">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="detail__discount">
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
              <div className="detail__qty-controls">
                <button
                  className="detail__qty-btn"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  aria-label="Diminuir quantidade"
                >−</button>
                <span className="detail__qty-value">{quantity}</span>
                <button
                  className="detail__qty-btn"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  aria-label="Aumentar quantidade"
                >+</button>
                <span className="detail__qty-label">no carrinho ✓</span>
              </div>
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
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="detail__reviews">
          <h2 className="detail__reviews-title">Avaliações dos clientes</h2>
          <div className="detail__reviews-list">
            {product.reviews.map((review, i) => (
              <div key={i} className="detail__review-card">
                <div className="detail__review-header">
                  <span className="detail__reviewer">{review.reviewerName}</span>
                  <span className="detail__review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                </div>
                <p className="detail__review-comment">{review.comment}</p>
                <span className="detail__review-date">
                  {new Date(review.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
