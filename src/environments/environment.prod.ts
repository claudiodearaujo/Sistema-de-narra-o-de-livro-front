export const environment = {
  production: true,
  apiUrl: 'https://api.yoursite.com/api',  // Update with production URL
  
  // Auth configuration
  auth: {
    tokenExpirationMinutes: 60,
    refreshTokenEnabled: true,
    rememberMeDays: 30
  },
  
  // Feature flags
  features: {
    socialNetwork: false,  // Enable when social module is ready
    emailVerification: true,
    twoFactorAuth: false
  }
};
