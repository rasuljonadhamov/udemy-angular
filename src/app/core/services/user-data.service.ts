import { Injectable, inject, effect } from '@angular/core';
import { AuthStore } from '../../store/auth.store';
import { CartStore } from '../../store/cart.store';
import { FavoritesStore } from '../../store/favorites.store';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private authStore = inject(AuthStore);
  private cartStore = inject(CartStore);
  private favoritesStore = inject(FavoritesStore);

  constructor() {
    effect(() => {
      const isAuthenticated = this.authStore.isAuthenticated();
      if (isAuthenticated) {
        this.authStore.refreshUserData();
        this.reloadUserSpecificData();
      } else {
        this.clearUserSpecificData();
      }
    });
  }

  reloadUserSpecificData() {
    this.cartStore.reloadUserData();
    this.favoritesStore.reloadUserData();
  }

  clearUserSpecificData() {
    this.cartStore.clearCart();
    this.favoritesStore.clearAll();
  }
}
