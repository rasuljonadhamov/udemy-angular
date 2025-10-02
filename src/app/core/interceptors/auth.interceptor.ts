import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const token = authStore.token();

  // Clone request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // unauthorized user
        authStore.logout();
        router.navigate(['/login']);
        notificationService.error('Session expired. Please login again');
      } else if (error.status === 403) {
        // no permission
        notificationService.error(
          'You do not have permission to access this resource'
        );
      } else if (error.status === 404) {
        notificationService.error('Resource not found');
      } else if (error.status >= 500) {
        notificationService.error('Server error. Please try again later');
      }

      return throwError(() => error);
    })
  );
};
