import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

interface UiState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  currentPage: string;
  scrollPosition: number;
}

const initialState: UiState = {
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  currentPage: 'home',
  scrollPosition: 0,
};

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    toggleSidebar() {
      patchState(store, { isSidebarOpen: !store.isSidebarOpen() });
    },

    toggleMobileMenu() {
      patchState(store, { isMobileMenuOpen: !store.isMobileMenuOpen() });
    },

    closeMobileMenu() {
      patchState(store, { isMobileMenuOpen: false });
    },

    toggleSearch() {
      patchState(store, { isSearchOpen: !store.isSearchOpen() });
    },

    setCurrentPage(page: string) {
      patchState(store, { currentPage: page });
    },

    saveScrollPosition(position: number) {
      patchState(store, { scrollPosition: position });
    },

    restoreScrollPosition() {
      window.scrollTo(0, store.scrollPosition());
    },
  }))
);
