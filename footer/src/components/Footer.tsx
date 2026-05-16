import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          &copy; {currentYear} TechStore. Todos os direitos reservados.
        </p>
        <nav className="footer__links">
          <a href="#termos" className="footer__link">Termos</a>
          <a href="#privacidade" className="footer__link">Privacidade</a>
          <a href="#suporte" className="footer__link">Suporte</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
