import React from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <h1 className="hero__title">Tudo que você precisa, em um só lugar</h1>
      <p className="hero__subtitle">
        Moda, tecnologia, casa, esportes e muito mais — com qualidade e preço que você merece.
      </p>
    </section>
  );
};

export default Hero;
