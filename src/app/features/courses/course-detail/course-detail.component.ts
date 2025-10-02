import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { Course, Review } from '../../../core/models/course.model';
import { AuthStore } from '../../../store/auth.store';
import { FavoritesStore } from '../../../store/favorites.store';
import { CartStore } from '../../../store/cart.store';
import { NotificationService } from '../../../core/services/notification.service';
import { CustomValidators } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  authStore = inject(AuthStore);
  favoritesStore = inject(FavoritesStore);
  cartStore = inject(CartStore);

  course = signal<Course | null>(null);
  reviews = signal<Review[]>([]);
  isLoading = signal(true);
  isPurchasing = signal(false);
  isSubmittingReview = signal(false);

  reviewForm = this.fb.nonNullable.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, CustomValidators.minLength(10)]],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(id);
      this.loadReviews(id);
    }
  }

  loadCourse(id: string) {
    this.isLoading.set(true);
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course.set(course);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.isLoading.set(false);
      },
    });
  }

  loadReviews(courseId: string) {
    this.courseService.getCourseReviews(courseId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      },
    });
  }

  toggleFavorite() {
    if (this.course() && this.authStore.isAuthenticated()) {
      const id = this.getCourseId();
      if (id) {
        this.favoritesStore.toggleFavorite(id);
        const isFav = this.favoritesStore.isFavorite()(id);
        this.notificationService.showSuccess(
          isFav ? 'Added to favorites' : 'Removed from favorites'
        );
      }
    }
  }

  addToCart() {
    if (this.course() && this.authStore.isAuthenticated()) {
      this.cartStore.addToCart(this.course()!);
      this.notificationService.showSuccess('Course added to cart');
    }
  }

  purchaseCourse() {
    if (!this.course() || !this.authStore.isAuthenticated()) return;

    this.isPurchasing.set(true);
    const id = this.getCourseId();
    if (!id) return;
    this.courseService.purchaseCourse(id).subscribe({
      next: () => {
        this.authStore.addPurchasedCourse(id);
        this.cartStore.removeFromCart(id);
        this.notificationService.showSuccess('Course purchased successfully!');
        this.router.navigate(['/courses', this.course()!.id, 'watch']);
      },
      error: (error) => {
        console.error('Error purchasing course:', error);
        this.notificationService.showError('Purchase failed. Please try again.');
        this.isPurchasing.set(false);
      },
    });
  }

  submitReview() {
    if (
      this.reviewForm.valid &&
      this.course() &&
      this.authStore.isAuthenticated()
    ) {
      this.isSubmittingReview.set(true);
      const user = this.authStore.user()!;
      const formValue = this.reviewForm.getRawValue();

      const review = {
        courseId: this.getCourseId(),
        userId: user.id,
        userName: user.name,
        rating: formValue.rating,
        comment: formValue.comment,
      };

      this.courseService.addReview(review).subscribe({
        next: (newReview) => {
          this.reviews.set([newReview, ...this.reviews()]);
          this.reviewForm.reset({ rating: 5, comment: '' });
          this.notificationService.showSuccess('Review submitted successfully!');
          this.isSubmittingReview.set(false);
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.notificationService.showError('Failed to submit review. Please try again.');
          this.isSubmittingReview.set(false);
        },
      });
    }
  }

  get isFavorite() {
    const id = this.getCourseId();
    return id ? this.favoritesStore.isFavorite()(id) : false;
  }

  get isInCart() {
    const id = this.getCourseId();
    return id ? this.cartStore.isInCart()(id) : false;
  }

  get isPurchased() {
    const id = this.getCourseId();
    return id ? (this.authStore.user()?.purchasedCourses?.includes(id) || false) : false;
  }

  private getCourseId(): string {
    const course = this.course();
    return course?._id || course?.id || '';
  }

  getRatingStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }
}
