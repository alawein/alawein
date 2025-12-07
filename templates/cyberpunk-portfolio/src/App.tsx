import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { BootSequence, InteractiveParticles, CyberGrid } from "@/components/effects";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const Projects = lazy(() => import("@/pages/Projects"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [showEffects, setShowEffects] = useState(false);

  // Check if this is a repeat visit (skip boot sequence)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('cyber-portfolio-visited');
    if (hasVisited) {
      setIsBooting(false);
      setShowEffects(true);
    }
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem('cyber-portfolio-visited', 'true');
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
          <InteractiveParticles />
          <CyberGrid />
        </>
      )}

      {!isBooting && (
        <Layout>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </Layout>
      )}
    </>
  );
}

