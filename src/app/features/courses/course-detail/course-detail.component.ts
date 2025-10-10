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
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SafeUrlPipe],
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
    if (!this.course()) {
      this.notificationService.showError('Course not found');
      return;
    }

    if (!this.authStore.isAuthenticated()) {
      this.notificationService.showError('Please login to add courses to cart');
      this.router.navigate(['/login']);
      return;
    }

    const courseId = this.getCourseId();
    if (!courseId) {
      this.notificationService.showError('Invalid course');
      return;
    }

    if (this.isPurchased) {
      this.notificationService.showError(
        'You have already purchased this course'
      );
      return;
    }

    if (this.isInCart) {
      this.notificationService.showError('Course is already in your cart');
      return;
    }

    this.cartStore.addToCart(this.course()!);
    this.notificationService.showSuccess('Course added to cart successfully!');
  }

  purchaseCourse() {
    if (!this.course()) {
      this.notificationService.showError('Course not found');
      return;
    }

    if (!this.authStore.isAuthenticated()) {
      this.notificationService.showError('Please login to purchase courses');
      this.router.navigate(['/login']);
      return;
    }

    const id = this.getCourseId();
    if (!id) {
      this.notificationService.showError('Invalid course');
      return;
    }

    if (this.isPurchased) {
      this.notificationService.showError(
        'You have already purchased this course'
      );
      this.router.navigate(['/courses', id, 'watch']);
      return;
    }

    this.isPurchasing.set(true);
    this.courseService.purchaseCourse(id).subscribe({
      next: () => {
        this.authStore.addPurchasedCourse(id);
        this.cartStore.removeFromCart(id);
        this.notificationService.showSuccess('Course purchased successfully!');
        this.isPurchasing.set(false);
        this.router.navigate(['/courses', id, 'watch']);
      },
      error: (error) => {
        console.error('Error purchasing course:', error);
        this.notificationService.showError(
          'Purchase failed. Please try again.'
        );
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
          this.notificationService.showSuccess('Review submited sucessfully!');
          this.isSubmittingReview.set(false);
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.notificationService.showError(
            'Failed to submit review. Please try again.'
          );
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
    return id
      ? this.authStore.user()?.purchasedCourses?.includes(id) || false
      : false;
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
