import React from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <h1 className="hero__title">Beleza e conforto para o seu dia a dia</h1>
      <p className="hero__subtitle">
        Maquiagem, cama, mesa e banho com qualidade e preço que você merece.
      </p>
    </section>
  );
};

export default Hero;
