import React, { useEffect, useState } from "react";
import { Product } from "../shared/types";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";

const TECH_CATEGORIES = ["smartphones", "tablets", "laptops", "mobile-accessories"];

const Home: React.FC = () => {
  const [topDiscounts, setTopDiscounts] = useState<Product[]>([]);
  const [techProducts, setTechProducts] = useState<Product[]>([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);
  const [loadingTech, setLoadingTech] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100&select=id,title,price,thumbnail,discountPercentage,stock,images,description,category,rating")
      .then((r) => r.json())
      .then((data) => {
        const sorted = (data.products as Product[])
          .filter((p) => (p.discountPercentage ?? 0) > 0)
          .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
          .slice(0, 10);
        setTopDiscounts(sorted);
      })
      .finally(() => setLoadingDiscounts(false));
  }, []);

  useEffect(() => {
    Promise.all(
      TECH_CATEGORIES.map((cat) =>
        fetch(`https://dummyjson.com/products/category/${cat}?limit=10&select=id,title,price,thumbnail,discountPercentage,stock,images,description,category,rating`)
          .then((r) => r.json())
          .then((d) => d.products as Product[])
      )
    )
      .then((results) => setTechProducts(results.flat()))
      .finally(() => setLoadingTech(false));
  }, []);

  return (
    <>
      <Hero />
      <main>
        <Carousel
          title="🔥 Maiores Descontos"
          products={topDiscounts}
          loading={loadingDiscounts}
        />
        <Carousel
          title="📱 Tecnologia"
          products={techProducts}
          loading={loadingTech}
        />
      </main>
    </>
  );
};

export default Home;
