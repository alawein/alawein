import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { BootSequence } from "@/components/effects/BootSequence";
import { OrbitalParticles } from "@/components/effects/OrbitalParticles";
import { RetroGrid } from "@/components/effects/RetroGrid";
import { Starfield } from "@/components/effects/Starfield";
import { AuroraBorealis } from "@/components/effects/AuroraBorealis";
import { CursorTrail } from "@/components/effects/CursorTrail";
import { ParticleCollision } from "@/components/effects/ParticleCollision";
import { WormholeTransition } from "@/components/effects/WormholeTransition";
import { SoundProvider } from "@/contexts/SoundContext";
import { SoundToggle } from "@/components/ui/SoundToggle";

// Lazy load pages
const Home = lazy(() => import("@/pages/Home"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Resume = lazy(() => import("@/pages/Resume"));
const Contact = lazy(() => import("@/pages/Contact"));

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [showEffects, setShowEffects] = useState(false);
  const location = useLocation();

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
    <SoundProvider>
      <AnimatePresence>
        {isBooting && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {showEffects && (
        <>
          {/* Background layers (back to front) */}
          <Starfield starCount={150} />
          <AuroraBorealis />
          <RetroGrid />
          <OrbitalParticles />

          {/* Interactive effects */}
          <CursorTrail />
          <ParticleCollision />

          {/* CRT overlay */}
          <div className="crt-overlay" />
        </>
      )}

      {!isBooting && (
        <Layout>
          <WormholeTransition>
            <Suspense fallback={<LoadingScreen />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </WormholeTransition>
        </Layout>
      )}

      {/* Sound toggle button */}
      {!isBooting && <SoundToggle />}
    </SoundProvider>
  );
}

