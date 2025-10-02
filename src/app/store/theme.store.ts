import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { StorageService } from '../core/services/storage.service';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  mode: ThemeMode;
  isDarkMode: boolean;
  systemPreference: 'light' | 'dark';
}

const initialState: ThemeState = {
  mode: 'light',
  isDarkMode: false,
  systemPreference: 'light',
};

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    themeLabel: computed(() => {
      const mode = store.mode();
      return mode.charAt(0).toUpperCase() + mode.slice(1);
    }),
    effectiveTheme: computed(() => {
      if (store.mode() === 'auto') {
        return store.systemPreference();
      }
      return store.mode() === 'dark' ? 'dark' : 'light';
    }),
  })),
  withMethods((store, storage = inject(StorageService)) => ({
    toggleTheme() {
      const currentMode = store.mode();
      const newMode: ThemeMode = currentMode === 'light' ? 'dark' : 'light';
      this.setTheme(newMode);
    },

    setTheme(mode: ThemeMode) {
      const isDark =
        mode === 'dark' ||
        (mode === 'auto' && store.systemPreference() === 'dark');

      patchState(store, {
        mode,
        isDarkMode: isDark,
      });

      storage.setItem('theme', mode);
      this.applyTheme(isDark);
    },

    applyTheme(isDark: boolean) {
      if (typeof document === 'undefined') return;
      
      if (isDark) {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    },

    detectSystemPreference() {
      if (typeof window === 'undefined') return;
      
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const preference = prefersDark ? 'dark' : 'light';

      patchState(store, { systemPreference: preference });

      if (store.mode() === 'auto') {
        this.applyTheme(prefersDark);
        patchState(store, { isDarkMode: prefersDark });
      }
    },

    loadFromStorage() {
      const savedMode = storage.getItem<ThemeMode>('theme');
      if (savedMode) {
        this.setTheme(savedMode);
      }
      this.detectSystemPreference();
    },

    listenToSystemChanges() {
      if (typeof window === 'undefined') return;
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', (e) => {
        const preference = e.matches ? 'dark' : 'light';
        patchState(store, { systemPreference: preference });

        if (store.mode() === 'auto') {
          this.applyTheme(e.matches);
          patchState(store, { isDarkMode: e.matches });
        }
      });
    },
  })),
  withHooks({
    onInit(store) {
      store.loadFromStorage();
      store.listenToSystemChanges();
    },
  })
);
