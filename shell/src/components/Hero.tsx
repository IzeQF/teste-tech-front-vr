import React from "react";
import "./Hero.css";

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <h1 className="hero__title">Tecnologia que inspira</h1>
      <p className="hero__subtitle">
        Descubra os melhores produtos de tecnologia com preços incríveis.
      </p>
    </section>
  );
};

export default Hero;
