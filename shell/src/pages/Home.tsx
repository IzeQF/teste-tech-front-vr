import React, { useEffect, useState } from "react";
import { Product } from "../shared/types";
import Hero from "../components/Hero";
import Carousel from "../components/Carousel";

const SELECT = "id,title,price,thumbnail,discountPercentage,stock,images,description,category,rating";

const GROUPS = [
  {
    key: "moda",
    title: "👗 Moda & Acessórios",
    categories: ["mens-shirts", "mens-shoes", "tops", "womens-dresses", "womens-shoes", "womens-bags", "sunglasses", "mens-watches", "womens-watches", "womens-jewellery"],
  },
  {
    key: "tech",
    title: "📱 Tecnologia",
    categories: ["smartphones", "tablets", "laptops", "mobile-accessories"],
  },
  {
    key: "casa",
    title: "🏠 Casa & Decoração",
    categories: ["furniture", "home-decoration", "kitchen-accessories"],
  },
  {
    key: "beleza",
    title: "💄 Beleza & Cuidados",
    categories: ["beauty", "fragrances", "skin-care"],
  },
  {
    key: "esportes",
    title: "🏋️ Esportes & Veículos",
    categories: ["sports-accessories", "groceries", "motorcycle", "vehicle"],
  },
];

const fetchGroup = (categories: string[]): Promise<Product[]> =>
  Promise.all(
    categories.map((cat) =>
      fetch(`https://dummyjson.com/products/category/${cat}?limit=10&select=${SELECT}`)
        .then((r) => r.json())
        .then((d) => d.products as Product[])
    )
  ).then((results) => results.flat());

const Home: React.FC = () => {
  const [topDiscounts, setTopDiscounts] = useState<Product[]>([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);

  const [groupProducts, setGroupProducts] = useState<Record<string, Product[]>>({});
  const [loadingGroups, setLoadingGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(GROUPS.map((g) => [g.key, true]))
  );

  useEffect(() => {
    fetch(`https://dummyjson.com/products?limit=100&select=${SELECT}`)
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
    GROUPS.forEach((group) => {
      fetchGroup(group.categories)
        .then((products) =>
          setGroupProducts((prev) => ({ ...prev, [group.key]: products }))
        )
        .finally(() =>
          setLoadingGroups((prev) => ({ ...prev, [group.key]: false }))
        );
    });
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
        {GROUPS.map((group) => (
          <Carousel
            key={group.key}
            title={group.title}
            products={groupProducts[group.key] ?? []}
            loading={loadingGroups[group.key]}
          />
        ))}
      </main>
    </>
  );
};

export default Home;
