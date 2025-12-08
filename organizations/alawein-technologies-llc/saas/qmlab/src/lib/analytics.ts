import { logger } from './logger';

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetIdOrDate?: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: any[];
  }
}

// Google Tag Manager Configuration for QMLab
const GTM_CONTAINER_ID = 'GTM-P5V49HTH';
const GA_MEASUREMENT_ID = 'G-7810TS77ND';

export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  // GTM is already loaded via HTML, just ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];
  
  // Push initial configuration to dataLayer
  window.dataLayer.push({
    event: 'qmlab_init',
    app_name: 'QMLab',
    app_version: import.meta.env.VITE_APP_VERSION || 'development',
    environment: import.meta.env.MODE || 'development'
  });

  logger.info('Google Tag Manager initialized', { GTM_CONTAINER_ID, GA_MEASUREMENT_ID });
};

// Event tracking functions using GTM dataLayer
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      event_category: parameters?.category || 'general',
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters
    });

    // Also try gtag if available (GTM may inject it)
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  }
};

// Enhanced quantum-specific events with comprehensive tracking
export const trackQuantumEvents = {
  // Circuit builder events
  circuitChange: (gateType: string, position: number, qubitIndex?: number) => {
    trackEvent('circuit_change', {
      gate_type: gateType,
      position: position,
      qubit_index: qubitIndex,
      timestamp: Date.now(),
      category: 'circuit_builder',
      engagement_type: 'interaction'
    });
  },
  
  circuitReset: (gateCount?: number) => {
    trackEvent('circuit_reset', {
      gates_cleared: gateCount || 0,
      timestamp: Date.now(),
      category: 'circuit_builder',
      engagement_type: 'reset'
    });
  },

  circuitRun: (gateCount: number, duration: number) => {
    trackEvent('circuit_run', {
      gate_count: gateCount,
      execution_duration_ms: duration,
      timestamp: Date.now(),
      category: 'circuit_builder',
      engagement_type: 'execution'
    });
  },
  
  // Training events with enhanced parameters
  trainingStart: (dataset: string, epochs: number, learningRate?: number) => {
    trackEvent('training_start', {
      dataset: dataset,
      epochs: epochs,
      learning_rate: learningRate,
      timestamp: Date.now(),
      category: 'training',
      engagement_type: 'start'
    });
  },
  
  trainingComplete: (dataset: string, finalLoss: number, duration: number, epochs: number) => {
    trackEvent('training_complete', {
      dataset: dataset,
      final_loss: finalLoss,
      duration_seconds: duration,
      epochs_completed: epochs,
      convergence_rate: finalLoss < 0.1 ? 'fast' : finalLoss < 0.5 ? 'medium' : 'slow',
      timestamp: Date.now(),
      category: 'training',
      engagement_type: 'completion'
    });
  },
  
  trainingStop: (dataset: string, currentEpoch: number, currentLoss: number) => {
    trackEvent('training_stop', {
      dataset: dataset,
      stopped_at_epoch: currentEpoch,
      loss_at_stop: currentLoss,
      completion_percentage: Math.min((currentEpoch / 100) * 100, 100),
      timestamp: Date.now(),
      category: 'training',
      engagement_type: 'interruption'
    });
  },
  
  // Bloch sphere events with detailed tracking
  blochInteraction: (interactionType: 'rotate' | 'zoom' | 'reset' | 'pause' | 'play') => {
    trackEvent('bloch_interaction', {
      interaction_type: interactionType,
      timestamp: Date.now(),
      category: 'visualization',
      engagement_type: 'interaction'
    });
  },

  blochStateChange: (theta: number, phi: number) => {
    trackEvent('bloch_state_change', {
      theta: theta,
      phi: phi,
      quadrant: Math.floor(theta / (Math.PI/2)) + 1,
      timestamp: Date.now(),
      category: 'visualization',
      engagement_type: 'state_tracking'
    });
  },
  
  // Enhanced UI and engagement events
  tutorialStart: (stepCount?: number) => {
    trackEvent('tutorial_start', {
      total_steps: stepCount || 3,
      timestamp: Date.now(),
      category: 'engagement',
      engagement_type: 'onboarding'
    });
  },
  
  tutorialStep: (stepNumber: number, totalSteps: number) => {
    trackEvent('tutorial_step', {
      step_number: stepNumber,
      total_steps: totalSteps,
      progress_percentage: Math.round((stepNumber / totalSteps) * 100),
      timestamp: Date.now(),
      category: 'engagement',
      engagement_type: 'onboarding'
    });
  },
  
  tutorialComplete: (totalSteps: number) => {
    trackEvent('tutorial_complete', {
      steps_completed: totalSteps,
      completion_rate: 100,
      timestamp: Date.now(),
      category: 'engagement',
      engagement_type: 'onboarding'
    });
  },

  tutorialSkip: (currentStep: number, totalSteps: number) => {
    trackEvent('tutorial_skip', {
      skipped_at_step: currentStep,
      total_steps: totalSteps,
      completion_percentage: Math.round((currentStep / totalSteps) * 100),
      timestamp: Date.now(),
      category: 'engagement',
      engagement_type: 'onboarding'
    });
  },

  tutorialReplay: () => {
    trackEvent('tutorial_replay', {
      timestamp: Date.now(),
      category: 'engagement',
      engagement_type: 'onboarding'
    });
  },
  
  featureDiscovery: (featureName: string, discoveryMethod?: string) => {
    trackEvent('feature_discovery', {
      feature_name: featureName,
      discovery_method: discoveryMethod || 'click',
      timestamp: Date.now(),
      category: 'engagement',
      engagement_type: 'discovery'
    });
  },

  // Navigation and user flow events
  heroInteraction: (buttonType: 'start_building' | 'watch_demo') => {
    trackEvent('hero_interaction', {
      button_type: buttonType,
      timestamp: Date.now(),
      category: 'navigation',
      engagement_type: 'cta_click'
    });
  },

  scrollToSection: (sectionName: string, scrollDepth: number) => {
    trackEvent('scroll_to_section', {
      section_name: sectionName,
      scroll_depth_percent: scrollDepth,
      timestamp: Date.now(),
      category: 'navigation',
      engagement_type: 'scroll'
    });
  },
  
  // Performance and technical events
  pageLoadTime: (loadTime: number, performanceEntries?: any) => {
    trackEvent('page_load_time', {
      load_time_ms: loadTime,
      fcp: performanceEntries?.fcp,
      lcp: performanceEntries?.lcp,
      cls: performanceEntries?.cls,
      fid: performanceEntries?.fid,
      ttfb: performanceEntries?.ttfb,
      timestamp: Date.now(),
      category: 'performance',
      engagement_type: 'timing'
    });
  },

  componentLoad: (componentName: string, loadTime: number) => {
    trackEvent('component_load', {
      component_name: componentName,
      load_time_ms: loadTime,
      timestamp: Date.now(),
      category: 'performance',
      engagement_type: 'lazy_loading'
    });
  },

  // Error and debugging events
  errorBoundary: (errorMessage: string, componentStack: string, errorBoundary: string) => {
    trackEvent('error_boundary_triggered', {
      error_message: errorMessage.substring(0, 200), // Truncate for GA4 limits
      component_stack: componentStack.substring(0, 500),
      error_boundary: errorBoundary,
      timestamp: Date.now(),
      category: 'error',
      engagement_type: 'exception'
    });
  },

  // Error recovery and user actions
  errorRecovery: (recoveryAction: string, errorContext?: string) => {
    trackEvent('error_recovery', {
      recovery_action: recoveryAction,
      error_context: errorContext,
      timestamp: Date.now(),
      category: 'error_handling',
      engagement_type: 'recovery'
    });
  },

  // Search and discovery events
  searchOpen: (trigger: string) => {
    trackEvent('search_open', {
      trigger_source: trigger,
      timestamp: Date.now(),
      category: 'search',
      engagement_type: 'interaction'
    });
  },

  searchResultClick: (resultType: string, resultTitle: string) => {
    trackEvent('search_result_click', {
      result_type: resultType,
      result_title: resultTitle,
      timestamp: Date.now(),
      category: 'search',
      engagement_type: 'selection'
    });
  },

  // User preferences and settings
  preferenceChange: (settingName: string, newValue: any, oldValue?: any) => {
    trackEvent('preference_change', {
      setting_name: settingName,
      new_value: String(newValue),
      old_value: oldValue ? String(oldValue) : undefined,
      timestamp: Date.now(),
      category: 'settings',
      engagement_type: 'customization'
    });
  }
};

// User properties
export const setUserProperties = (properties: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

// Custom dimensions
export const setCustomDimensions = (dimensions: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      custom_map: dimensions
    });
  }
};

// GA4 Debug and Validation Utilities
export const debugGA4 = {
  // Enable debug mode (shows events in console)
  enableDebugMode: () => {
    if (typeof window !== 'undefined') {
      // Enable GTM debug via dataLayer
      window.dataLayer.push({
        event: 'gtm.debug_mode',
        debug_enabled: true
      });

      // Also enable GA4 debug if gtag is available
      if (window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          debug_mode: true
        });
      }
      
      console.log('🔍 GTM & GA4 Debug Mode Enabled for QMLab');
      console.log('📊 GTM Preview: https://tagmanager.google.com/');
    }
  },

  // Show current dataLayer contents
  showDataLayer: () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      console.log('📋 Current dataLayer:', window.dataLayer);
      return window.dataLayer;
    }
  },

  // Test event firing
  testEventFiring: () => {
    const testEvents = [
      () => trackQuantumEvents.featureDiscovery('debug_test'),
      () => trackEvent('page_view', { page_path: '/test', page_location: 'debug' }),
      () => trackQuantumEvents.circuitChange('H', 0, 0)
    ];

    testEvents.forEach((eventFn, index) => {
      setTimeout(() => {
        eventFn();
        console.log(`✅ Test event ${index + 1} fired`);
      }, index * 500);
    });

    console.log('🧪 GA4 Test Events Sequence Started');
  },

  // Validate required events are firing
  validateEventTaxonomy: () => {
    const requiredEvents = [
      'page_view',
      'circuit_change', 
      'circuit_reset',
      'training_start',
      'bloch_interaction',
      'feature_discovery',
      'page_load_time'
    ];

    console.log('📊 QMLab Event Taxonomy Validation:');
    console.log('Required Events:', requiredEvents);
    console.log('📝 Check GA4 DebugView for these events');
    console.log('🎯 Acceptance: >90% event delivery, all parameters populated');
  },

  // Performance measurement
  measureAndTrack: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const performanceMetrics = {
        fcp: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime,
        lcp: null, // Will be measured by observer
        ttfb: perfData.responseStart - perfData.requestStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart
      };

      trackQuantumEvents.pageLoadTime(
        perfData.loadEventEnd - perfData.fetchStart,
        performanceMetrics
      );

      console.log('⚡ Performance metrics tracked:', performanceMetrics);
    }
  }
};

// Analytics Health Monitor
export const analyticsHealth = {
  // Check if GA4 is properly initialized
  isInitialized: (): boolean => {
    return typeof window !== 'undefined' && 
           typeof window.gtag === 'function' && 
           window.dataLayer && 
           window.dataLayer.length > 0;
  },

  // Monitor event delivery rate
  eventDeliveryMonitor: (() => {
    let eventsSent = 0;
    let eventsDelivered = 0;

    return {
      incrementSent: () => eventsSent++,
      incrementDelivered: () => eventsDelivered++,
      getDeliveryRate: () => eventsSent > 0 ? (eventsDelivered / eventsSent) * 100 : 0,
      getStats: () => ({ sent: eventsSent, delivered: eventsDelivered })
    };
  })(),

  // Generate analytics dashboard URL
  getDashboardUrl: (reportType: 'realtime' | 'engagement' | 'events' = 'realtime') => {
    const baseUrl = 'https://analytics.google.com/analytics/web/';
    const propertyId = GA_MEASUREMENT_ID.replace('G-', '');
    
    const urls = {
      realtime: `${baseUrl}#/realtime/rt-overview/a${propertyId}w${propertyId}p${propertyId}/`,
      engagement: `${baseUrl}#/analysis/a${propertyId}w${propertyId}p${propertyId}/`,
      events: `${baseUrl}#/analysis/a${propertyId}w${propertyId}p${propertyId}/`
    };
    
    return urls[reportType];
  }
};

// Initialize debug mode in development
if (import.meta.env.MODE === 'development') {
  setTimeout(() => {
    if (analyticsHealth.isInitialized()) {
      debugGA4.enableDebugMode();
      console.log('🎯 QMLab Analytics Ready');
      console.log('📊 Dashboard:', analyticsHealth.getDashboardUrl());
      console.log('🔍 Run debugGA4.testEventFiring() to test events');
    }
  }, 1000);
}