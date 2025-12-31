export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'http://localhost:3000',
  
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
