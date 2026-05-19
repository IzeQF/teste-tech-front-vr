import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./shared/CartContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";

const Header = lazy(() => import("header/Header"));
const Footer = lazy(() => import("footer/Footer"));
const Cards = lazy(() => import("cards/Cards"));

const Produtos: React.FC = () => (
  <main>
    <Suspense fallback={null}>
      <Cards />
    </Suspense>
  </main>
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
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/contato" element={<Contact />} />
        </Routes>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
