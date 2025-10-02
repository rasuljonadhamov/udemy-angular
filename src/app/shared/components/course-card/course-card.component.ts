import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { FavoritesStore } from '../../../store/favorites.store';
import { CartStore } from '../../../store/cart.store';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
})
export class CourseCardComponent {
  course = input.required<Course>();
  showActions = input(true);

  favoritesStore = inject(FavoritesStore);
  cartStore = inject(CartStore);
  authStore = inject(AuthStore);

  favoriteToggled = output<string>();
  addedToCart = output<Course>();

  onFavoriteClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const id = this.getCourseId();
    if (this.authStore.isAuthenticated() && id) {
      this.favoritesStore.toggleFavorite(id);
      this.favoriteToggled.emit(id);
    }
  }

  onAddToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.authStore.isAuthenticated()) {
      this.cartStore.addToCart(this.course());
      this.addedToCart.emit(this.course());
    }
  }



  private getCourseId(): string {
    const course = this.course();
    return course._id || course.id || '';
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
}
