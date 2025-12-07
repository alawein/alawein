import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { BootSequence } from "@/components/effects/BootSequence";
import { OrbitalParticles } from "@/components/effects/OrbitalParticles";
import { RetroGrid } from "@/components/effects/RetroGrid";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Resume = lazy(() => import("@/pages/Resume"));
const Contact = lazy(() => import("@/pages/Contact"));

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('quantum-portfolio-visited');
    if (hasVisited) {
      setIsBooting(false);
      setShowEffects(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('quantum-portfolio-visited', 'true');
    setIsBooting(false);
    setTimeout(() => setShowEffects(true), 500);
  };

  return (
    <>
      <AnimatePresence>
        {isBooting && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {showEffects && (
        <>
          <OrbitalParticles />
          <RetroGrid />
          <div className="crt-overlay" />
        </>
      )}

      {!isBooting && (
        <Layout>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </Layout>
      )}
    </>
  );
}

