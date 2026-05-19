import React, { useState } from "react";
import { useCart } from "shell/CartContext";
import "./Header.css";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, totalItems, isSyncing } = useCart();

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <>
      <header className="header">
        <a href="/" className="header__logo">
          UniStore
        </a>

        <button
          className={`header__menu-btn${menuOpen ? " header__menu-btn--open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav
          id="main-nav"
          aria-label="Navegação principal"
          className={`header__nav-wrapper${menuOpen ? " header__nav-wrapper--open" : ""}`}
        >
          <ul className="header__nav" onClick={() => setMenuOpen(false)}>
            <li><a href="/" className="header__nav-link">Início</a></li>
            <li><a href="#produtos" className="header__nav-link">Produtos</a></li>
            <li><a href="/contato" className="header__nav-link">Contato</a></li>
          </ul>
        </nav>

        <button
          className="header__cart-btn"
          onClick={() => setIsOpen(true)}
          aria-label={`Abrir carrinho${totalItems > 0 ? `, ${totalItems} ${totalItems === 1 ? "item" : "itens"}` : ""}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {totalItems > 0 && (
            <span className="header__cart-badge" aria-hidden="true">{totalItems}</span>
          )}
        </button>
      </header>

      {isOpen && (
        <div
          className="cart-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="cart-modal" role="dialog" aria-modal="true" aria-labelledby="cart-modal-title">
            <div className="cart-modal__header">
              <h2 className="cart-modal__title" id="cart-modal-title">
                Minha Sacola
                {isSyncing && <span className="cart-modal__syncing" aria-live="polite" aria-label="Sincronizando carrinho">● sincronizando...</span>}
              </h2>
              <button
                className="cart-modal__close"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar carrinho"
              >
                ×
              </button>
            </div>

            <div className="cart-modal__body">
              {items.length === 0 ? (
                <p className="cart-modal__empty">Seu carrinho está vazio.</p>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <img
                      className="cart-item__image"
                      src={item.product.thumbnail}
                      alt={item.product.title}
                    />
                    <div className="cart-item__info">
                      <p className="cart-item__title">{item.product.title}</p>
                      <p className="cart-item__price">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="cart-item__qty-controls">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => {
                            if (item.quantity === 1) {
                              if (window.confirm(`Remover "${item.product.title}" da sacola?`)) {
                                updateQuantity(item.product.id, 0);
                              }
                            } else {
                              updateQuantity(item.product.id, item.quantity - 1);
                            }
                          }}
                          aria-label="Diminuir quantidade"
                        >−</button>
                        <span className="cart-item__qty-value" aria-label={`quantidade: ${item.quantity}`}>{item.quantity}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Aumentar quantidade"
                          disabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
                          title={item.product.stock !== undefined && item.quantity >= item.product.stock ? `Estoque máximo: ${item.product.stock} un.` : undefined}
                        >+</button>
                      </div>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item.product.id)}
                      aria-label={`Remover ${item.product.title} do carrinho`}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-modal__footer">
                <div className="cart-modal__total">
                  <span>Total</span>
                  <span className="cart-modal__total-value">
                    {formatPrice(total)}
                  </span>
                </div>
                <button className="cart-modal__clear" onClick={clearCart}>
                  Limpar carrinho
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
