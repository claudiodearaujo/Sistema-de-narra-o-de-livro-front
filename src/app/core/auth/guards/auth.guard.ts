import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard that protects routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasToken() && !authService.isTokenExpired()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  const returnUrl = state.url;
  
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl }
  });
};

/**
 * Guard that checks for specific user roles.
 * Use with route data: { roles: ['ADMIN', 'WRITER'] }
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[] | undefined;
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const userRole = authService.userRole();
  
  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // Redirect to unauthorized page or dashboard
  return router.createUrlTree(['/unauthorized']);
};

/**
 * Guard that ensures user email is verified.
 * Redirects to verification page if not verified.
 */
export const verifiedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  
  if (user?.isVerified) {
    return true;
  }

  return router.createUrlTree(['/auth/verify-email']);
};
