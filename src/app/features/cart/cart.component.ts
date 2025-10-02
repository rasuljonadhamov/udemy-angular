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
  styleUrl: './cart.component.css'
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
    const items = this.cartStore.items();
    if (items.length === 0) return;

    this.isCheckingOut.set(true);
    
    const purchaseRequests = items.map(course => 
      this.courseService.purchaseCourse(this.getCourseId(course))
    );

    forkJoin(purchaseRequests).subscribe({
      next: () => {
        items.forEach(course => {
          this.authStore.addPurchasedCourse(this.getCourseId(course));
        });
        this.cartStore.clearCart();
        this.notificationService.showSuccess('Purchase successful! You can now access your courses.');
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Error during checkout:', error);
        this.notificationService.showError('Purchase failed. Please try again.');
      },
      complete: () => {
        this.isCheckingOut.set(false);
      }
    });
  }
}