import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./shared/CartContext";
import Hero from "./components/Hero";
import ProductDetail from "./pages/ProductDetail";

const Header = lazy(() => import("header/Header"));
const Footer = lazy(() => import("footer/Footer"));
const Cards = lazy(() => import("cards/Cards"));

const Home: React.FC = () => (
  <>
    <Hero />
    <main>
      <Suspense fallback={null}>
        <Cards />
      </Suspense>
    </main>
  </>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Suspense fallback={null}>
          <Header />
        </Suspense>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
