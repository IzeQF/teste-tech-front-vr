import React, { Suspense, lazy } from "react";
import { CartProvider } from "./shared/CartContext";
import Hero from "./components/Hero";

const Header = lazy(() => import("header/Header"));
const Footer = lazy(() => import("footer/Footer"));
const Cards = lazy(() => import("cards/Cards"));

const App: React.FC = () => {
  return (
    <CartProvider>
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <Hero />

      <main>
        <Suspense fallback={null}>
          <Cards />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </CartProvider>
  );
};

export default App;
