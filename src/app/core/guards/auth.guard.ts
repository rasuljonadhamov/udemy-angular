import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (authStore.isAuthenticated()) {
    return true;
  }

  notificationService.warning('Please login to access this page');
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
