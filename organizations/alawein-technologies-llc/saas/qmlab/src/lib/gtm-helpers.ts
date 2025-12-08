// GTM Testing and Debugging Helpers for QMLab
// This file provides utilities to test and validate your GTM setup

export const GTMHelpers = {
  // Container and measurement IDs
  GTM_CONTAINER_ID: 'GTM-P5V49HTH',
  GA_MEASUREMENT_ID: 'G-7810TS77ND',

  // Check if GTM is properly loaded
  isGTMLoaded: (): boolean => {
    return typeof window !== 'undefined' && 
           window.dataLayer && 
           Array.isArray(window.dataLayer) &&
           window.dataLayer.some((item: any) => item.event === 'gtm.js');
  },

  // Check if GA4 is loaded through GTM
  isGA4Loaded: (): boolean => {
    return typeof window !== 'undefined' && 
           typeof window.gtag === 'function';
  },

  // Show current GTM status
  getStatus: () => {
    const status = {
      gtm_loaded: GTMHelpers.isGTMLoaded(),
      ga4_loaded: GTMHelpers.isGA4Loaded(),
      dataLayer_length: window?.dataLayer?.length || 0,
      container_id: GTMHelpers.GTM_CONTAINER_ID,
      measurement_id: GTMHelpers.GA_MEASUREMENT_ID,
      environment: import.meta.env.MODE
    };

    console.log('🏷️ GTM Status for QMLab:', status);
    return status;
  },

  // Push custom event to test GTM
  testEvent: (eventName: string = 'qmlab_test_event') => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        custom_parameter: 'test_value',
        timestamp: Date.now(),
        source: 'gtm_helpers'
      });

      console.log(`🧪 Test event "${eventName}" pushed to dataLayer`);
      return true;
    }
    return false;
  },

  // Show recent dataLayer events
  showRecentEvents: (count: number = 10) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      const recentEvents = window.dataLayer.slice(-count);
      console.log(`📋 Last ${count} dataLayer events:`, recentEvents);
      return recentEvents;
    }
    return [];
  },

  // Useful URLs for debugging
  getDebugUrls: () => {
    return {
      gtm_preview: `https://tagmanager.google.com/#/container/accounts/364742481/containers/95050434/workspaces/2`,
      ga4_debugview: `https://analytics.google.com/analytics/web/#/p12013960833/debugview?params=_u..nav%3D1`,
      ga4_realtime: `https://analytics.google.com/analytics/web/#/p12013960833/realtime?params=_u..nav%3D1`,
      ga4_reports: `https://analytics.google.com/analytics/web/#/p12013960833/reports/dashboard?params=_u..nav%3D1`
    };
  },

  // Run comprehensive test
  runDiagnostic: () => {
    console.log('🔍 Running QMLab GTM Diagnostic...');
    
    // Check status
    const status = GTMHelpers.getStatus();
    
    // Test event firing
    GTMHelpers.testEvent('diagnostic_test');
    
    // Show recent events
    GTMHelpers.showRecentEvents(5);
    
    // Show debug URLs
    console.log('🔗 Debug URLs:', GTMHelpers.getDebugUrls());
    
    // Recommendations
    console.log('📝 Next Steps:');
    if (!status.gtm_loaded) {
      console.log('❌ GTM not loaded - check HTML head for GTM script');
    } else {
      console.log('✅ GTM loaded successfully');
    }
    
    if (!status.ga4_loaded) {
      console.log('❌ GA4 not loaded - check GTM tags configuration');
    } else {
      console.log('✅ GA4 loaded successfully');
    }
    
    console.log('🎯 Open GTM Preview mode to see live event data');
    console.log('📊 Check GA4 DebugView for real-time event validation');
    
    return status;
  }
};

// Auto-run diagnostic in development
if (import.meta.env.MODE === 'development') {
  setTimeout(() => {
    console.log('🚀 QMLab GTM Auto-Diagnostic Starting...');
    GTMHelpers.runDiagnostic();
  }, 2000);
}

// Make available globally for console debugging
if (typeof window !== 'undefined') {
  (window as any).GTMHelpers = GTMHelpers;
}