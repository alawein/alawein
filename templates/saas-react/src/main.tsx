import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/lib/errorBoundary";
import { queryClient } from "@/lib/queryClient";
import { measurePerformance } from "@/lib/performance";
import App from "./App";
import "./index.css";

if (import.meta.env.PROD) {
  measurePerformance();
}

// Polyfill for View Transitions API
if (!('startViewTransition' in document)) {
  (Document.prototype as any).startViewTransition = (callback: () => void) => {
    callback();
    return { finished: Promise.resolve(), ready: Promise.resolve(), updateCallbackDone: Promise.resolve() };
  };
}

// Enable View Transitions API
if ('startViewTransition' in document) {
  document.documentElement.classList.add('view-transitions');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                if (confirm('New version available! Reload to update?')) {
                  newWorker.postMessage({ action: 'skipWaiting' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => console.error('SW registration failed:', error));
  });
}

