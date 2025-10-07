import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const cache = new Map<string, HttpResponse<any>>();
const CACHE_DURATION = 5 * 60 * 1000; 

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  if (req.url.includes('/auth/') || req.headers.has('X-Skip-Cache')) {
    return next(req);
  }

  const cachedResponse = cache.get(req.url);

  if (cachedResponse) {
    return of(cachedResponse.clone());
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, event.clone());

        setTimeout(() => {
          cache.delete(req.url);
        }, CACHE_DURATION);
      }
    })
  );
};
