import React, { Suspense, lazy } from "react";
import Hero from "./components/Hero";

const Header = lazy(() => import("header/Header"));
const Footer = lazy(() => import("footer/Footer"));
const Cards = lazy(() => import("cards/Cards"));

const App: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default App;
