import { Routes } from '@angular/router';
// import { AuthGuard } from './core/guards/auth.guard';
// import { GuestGuard } from './core/guards/guest.guard';
// import { PurchaseGuard } from './core/guards/purchase.guard';
import { HomeComponent } from './home.component';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';
import { purchaseGuard } from './core/guards/purchase.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [guestGuard],
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/course-list/course-list.component').then(
        (m) => m.CourseListComponent
      ),
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/courses/course-detail/course-detail.component').then(
        (m) => m.CourseDetailComponent
      ),
  },
  {
    path: 'courses/:id/watch',
    loadComponent: () =>
      import('./features/courses/course-video/course-video.component').then(
        (m) => m.CourseVideoComponent
      ),
    canActivate: [authGuard, purchaseGuard],
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then(
        (m) => m.FavoritesComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'my-learning',
    loadComponent: () =>
      import('./features/my-learning/my-learning.component').then(
        (m) => m.MyLearningComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
