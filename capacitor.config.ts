import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pro.turftrack.app',
  appName: 'TurfTrack',
  webDir: 'public',
  server: {
    // Point this to your live deployed backend/frontend URL
    url: 'https://turf-frontend-alpha.vercel.app',
    cleartext: true,
    errorPath: '/offline.html'
  }
};

export default config;