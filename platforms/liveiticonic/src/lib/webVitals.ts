// Web Vitals monitoring
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

export function initWebVitals() {
  onCLS(console.log);
  onINP(console.log);
  onLCP(console.log);
  onFCP(console.log);
  onTTFB(console.log);
}

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onFCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
}
