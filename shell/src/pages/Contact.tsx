import React, { useState } from "react";
import "./Contact.css";

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="contact">
      <section className="contact__hero">
        <h1 className="contact__heading">Fale Conosco</h1>
        <p className="contact__sub">Estamos aqui para ajudar. Entre em contato!</p>
      </section>

      <div className="contact__layout">
        <aside className="contact__info">
          <h2 className="contact__info-title">Informações</h2>
          <ul className="contact__info-list">
            <li>
              <span aria-hidden="true">📍</span>
              <span>Av. Paulista, 1000 — São Paulo, SP</span>
            </li>
            <li>
              <span aria-hidden="true">📞</span>
              <a href="tel:+551140002000">(11) 4000-2000</a>
            </li>
            <li>
              <span aria-hidden="true">✉️</span>
              <a href="mailto:contato@unistore.com.br">contato@unistore.com.br</a>
            </li>
            <li>
              <span aria-hidden="true">🕐</span>
              <span>Seg–Sex: 9h às 18h</span>
            </li>
          </ul>
        </aside>

        <section className="contact__form-section" aria-label="Formulário de contato">
          {sent ? (
            <div className="contact__success" role="alert">
              <span aria-hidden="true">✅</span>
              <p>Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit} noValidate>
              <div className="contact__field">
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="contact__field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="contact__field">
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Como podemos ajudar?"
                />
              </div>
              <button type="submit" className="contact__submit">
                Enviar mensagem
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default Contact;
