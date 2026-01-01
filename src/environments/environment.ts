export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'http://localhost:3000',
  
  // Push Notifications VAPID Key
  // Generate with: npx web-push generate-vapid-keys
  vapidPublicKey: '',  // Set your VAPID public key here
  
  // Auth configuration
  auth: {
    tokenExpirationMinutes: 60,
    refreshTokenEnabled: true,
    rememberMeDays: 30
  },
  
  // Feature flags
  features: {
    socialNetwork: true,
    emailVerification: true,
    twoFactorAuth: false,
    pushNotifications: true
  }
};
