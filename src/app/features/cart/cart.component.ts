import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartStore } from '../../store/cart.store';
import { CourseService } from '../../core/services/course.service';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../../core/services/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartStore = inject(CartStore);
  authStore = inject(AuthStore);
  private courseService = inject(CourseService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  isCheckingOut = signal(false);

  private getCourseId(course: any): string {
    return course._id || course.id || '';
  }

  removeFromCart(courseId: string | undefined) {
    if (courseId) {
      this.cartStore.removeFromCart(courseId);
      this.notificationService.showSuccess('Course removed from cart');
    }
  }

  checkout() {
    if (!this.authStore.isAuthenticated()) {
      this.notificationService.showError('Please login to checkout');
      this.router.navigate(['/login']);
      return;
    }

    const items = this.cartStore.items();
    if (items.length === 0) {
      this.notificationService.showError('Your cart is empty');
      return;
    }

    const purchasedCourseIds = this.authStore.user()?.purchasedCourses || [];
    const alreadyPurchased = items.filter((course) =>
      purchasedCourseIds.includes(this.getCourseId(course))
    );

    if (alreadyPurchased.length > 0) {
      this.notificationService.showError(
        `You have already purchased ${alreadyPurchased.length} course(s). They will be removed from cart.`
      );
      this.cartStore.removePurchasedCourses(purchasedCourseIds);
      return;
    }

    this.isCheckingOut.set(true);

    const purchaseRequests = items.map((course) =>
      this.courseService.purchaseCourse(this.getCourseId(course))
    );

    forkJoin(purchaseRequests).subscribe({
      next: () => {
        const courseIds = items.map((course) => this.getCourseId(course));
        this.authStore.addPurchasedCourses(courseIds);
        this.cartStore.clearCart();
        this.notificationService.showSuccess(
          `Successfully purchased ${items.length} course(s)! You can now access your courses.`
        );
        this.isCheckingOut.set(false);
        this.router.navigate(['/my-learning']);
      },
      error: (error) => {
        console.error('Error during checkout:', error);
        this.notificationService.showError(
          'Purchase failed. Please try again.'
        );
        this.isCheckingOut.set(false);
      },
    });
  }
}
