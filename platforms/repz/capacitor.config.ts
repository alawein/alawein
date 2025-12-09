import { CapacitorConfig } from '@capacitor/cli';

/**
 * REPZ Capacitor Configuration
 *
 * For development: Uses Lovable.dev URL
 * For production: Comment out server.url to use local dist/
 *
 * Build Commands:
 * - iOS: npx cap add ios && npx cap open ios
 * - Android: npx cap add android && npx cap open android
 * - Sync: npx cap sync
 */
const config: CapacitorConfig = {
  // Production App ID - matches App Store / Play Store
  appId: 'app.getrepz.coach',
  appName: 'REPZ Coach',
  webDir: 'dist',

  // Development: Use Lovable.dev URL
  // Production: Comment this block to use local dist/
  server: {
    // Uncomment for development with Lovable.dev
    // url: 'https://7ca8ebb6-11eb-491a-b264-a7e1acec4e70.lovableproject.com?forceHideBadge=true',
    // cleartext: true,

    // Production settings
    androidScheme: 'https',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1a1a1a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'large',
      spinnerColor: '#10b981', // REPZ brand green
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a1a',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },

  // iOS-specific settings
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'repz',
  },

  // Android-specific settings
  android: {
    backgroundColor: '#1a1a1a',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Set to true for dev
  },
};

export default config;
