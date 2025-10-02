import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b0c506328ae44cb285f2a7512b4e4743',
  appName: 'paw-dna-breed-hub',
  webDir: 'dist',
  server: {
    url: 'https://b0c50632-8ae4-4cb2-85f2-a7512b4e4743.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    ScreenProtection: {
      // Prevent screenshots and screen recordings
      enable: true,
      // Show toast when screenshot is attempted
      showToast: true,
      toastMessage: "Screenshots are disabled for security purposes"
    }
  },
  android: {
    // Prevent screenshots on Android
    allowMixedContent: false
  },
  ios: {
    // Prevent screenshots will be handled by native code
    contentInset: 'automatic'
  }
};

export default config;
