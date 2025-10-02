import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';
import { FavoritesStore } from '../../../store/favorites.store';
import { CartStore } from '../../../store/cart.store';
import { ThemeStore } from '../../../store/theme.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authStore = inject(AuthStore);
  favoritesStore = inject(FavoritesStore);
  cartStore = inject(CartStore);
  themeStore = inject(ThemeStore);

  logout() {
    this.authStore.logout();
  }

  toggleTheme() {
    this.themeStore.toggleTheme();
  }
}
