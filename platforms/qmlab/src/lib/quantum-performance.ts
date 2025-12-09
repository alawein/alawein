/**
 * Quantum Performance Monitoring
 * Tracks performance metrics specific to quantum visualizations and animations
 */

interface QuantumMetrics {
  animationFrameRate: number;
  memoryUsage: number;
  interactionLatency: number;
  threejsRenderTime: number;
  quantumOperationsPerSecond: number;
}

class QuantumPerformanceMonitor {
  private metrics: Partial<QuantumMetrics> = {};
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private isMonitoring = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    // Track animation performance for quantum effects
    window.addEventListener('animationend', (event) => {
      const animationName = (event as AnimationEvent).animationName;
      if (animationName.startsWith('quantum-')) {
        this.trackQuantumAnimation(animationName);
      }
    });

    // Track Three.js render performance
    window.addEventListener('quantum-render-complete', (event: CustomEvent) => {
      this.metrics.threejsRenderTime = event.detail.renderTime;
    });
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    
    this.monitorAnimationFrames();
    this.monitorMemoryUsage();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  private monitorAnimationFrames() {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    // Calculate FPS every second
    if (currentTime - this.lastFrameTime >= 1000) {
      this.metrics.animationFrameRate = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = currentTime;

      // Log performance warnings for quantum effects
      if (this.metrics.animationFrameRate < 30) {
        console.warn('⚠️ Quantum animations running below 30 FPS:', this.metrics.animationFrameRate);
      }
    }

    requestAnimationFrame(() => this.monitorAnimationFrames());
  }

  private monitorMemoryUsage() {
    if (!(performance as any).memory) return;

    const memory = (performance as any).memory;
    this.metrics.memoryUsage = memory.usedJSHeapSize / 1048576; // Convert to MB
    
    // Monitor Three.js memory specifically
    if (this.metrics.memoryUsage > 100) {
      console.warn('⚠️ High memory usage detected:', this.metrics.memoryUsage.toFixed(2), 'MB');
    }
  }

  private trackQuantumAnimation(animationName: string) {
    // Track specific quantum animation performance
    const animationMetrics = {
      name: animationName,
      timestamp: performance.now(),
      memoryAtStart: (performance as any).memory?.usedJSHeapSize || 0
    };

    // Store for analytics if needed
    if (window.gtag) {
      window.gtag('event', 'quantum_animation_performance', {
        animation_name: animationName,
        memory_usage: this.metrics.memoryUsage,
        frame_rate: this.metrics.animationFrameRate
      });
    }
  }

  trackQuantumInteraction(interactionType: string) {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      this.metrics.interactionLatency = endTime - startTime;
      
      // Log slow interactions
      if (this.metrics.interactionLatency > 100) {
        console.warn('⚠️ Slow quantum interaction:', interactionType, 'took', this.metrics.interactionLatency.toFixed(2), 'ms');
      }

      // Track in analytics
      if (window.gtag) {
        window.gtag('event', 'quantum_interaction_performance', {
          interaction_type: interactionType,
          latency: this.metrics.interactionLatency,
          custom_metric_1: this.metrics.animationFrameRate
        });
      }
    };
  }

  getMetrics(): Partial<QuantumMetrics> {
    return { ...this.metrics };
  }

  // Utility to optimize quantum animations based on performance
  getOptimalAnimationSettings() {
    const fps = this.metrics.animationFrameRate || 60;
    const memory = this.metrics.memoryUsage || 0;

    if (fps < 30 || memory > 150) {
      return {
        intensity: 'low',
        particleCount: 50,
        animationDuration: 4000,
        useGPUAcceleration: false
      };
    } else if (fps < 50) {
      return {
        intensity: 'medium',
        particleCount: 100,
        animationDuration: 3000,
        useGPUAcceleration: true
      };
    } else {
      return {
        intensity: 'high',
        particleCount: 200,
        animationDuration: 2000,
        useGPUAcceleration: true
      };
    }
  }

  // Debug helper for development
  logPerformanceReport() {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔬 Quantum Performance Report');
      console.log('Animation Frame Rate:', this.metrics.animationFrameRate, 'fps');
      console.log('Memory Usage:', this.metrics.memoryUsage?.toFixed(2), 'MB');
      console.log('Interaction Latency:', this.metrics.interactionLatency?.toFixed(2), 'ms');
      console.log('Three.js Render Time:', this.metrics.threejsRenderTime?.toFixed(2), 'ms');
      console.log('Optimal Settings:', this.getOptimalAnimationSettings());
      console.groupEnd();
    }
  }
}

// Global instance
export const quantumPerformanceMonitor = new QuantumPerformanceMonitor();

// React hook for performance monitoring
export const useQuantumPerformance = () => {
  const startMonitoring = () => quantumPerformanceMonitor.startMonitoring();
  const stopMonitoring = () => quantumPerformanceMonitor.stopMonitoring();
  const getMetrics = () => quantumPerformanceMonitor.getMetrics();
  const trackInteraction = (type: string) => quantumPerformanceMonitor.trackQuantumInteraction(type);
  const logReport = () => quantumPerformanceMonitor.logPerformanceReport();

  return {
    startMonitoring,
    stopMonitoring,
    getMetrics,
    trackInteraction,
    logReport,
    getOptimalSettings: () => quantumPerformanceMonitor.getOptimalAnimationSettings()
  };
};

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  quantumPerformanceMonitor.startMonitoring();
  
  // Log performance report every 10 seconds in development
  setInterval(() => {
    quantumPerformanceMonitor.logPerformanceReport();
  }, 10000);
}