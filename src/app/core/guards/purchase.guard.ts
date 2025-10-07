import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../services/notification.service';

export const purchaseGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const courseId = route.paramMap.get('id');
  const user = authStore.user();

  if (!user || !courseId) {
    router.navigate(['/login']);
    return false;
  }

  const hasPurchased = user.purchasedCourses?.includes(courseId);

  if (hasPurchased) {
    return true;
  }

  notificationService.error('You need to purchase this course first');
  router.navigate(['/courses', courseId]);
  return false;
};
