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

interface FavoritesState {
  courseIds: string[];
  lastModified: number | null;
}

const initialState: FavoritesState = {
  courseIds: [],
  lastModified: null,
};

export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    count: computed(() => store.courseIds().length),
    isEmpty: computed(() => store.courseIds().length === 0),
    isFavorite: computed(
      () => (courseId: string) => store.courseIds().includes(courseId)
    ),
    recentFavorites: computed(() => store.courseIds().slice(-5).reverse()),
  })),
  withMethods((store, storage = inject(StorageService)) => ({
    addToFavorites(courseId: string) {
      const currentIds = store.courseIds();
      if (!currentIds.includes(courseId)) {
        const updated = [...currentIds, courseId];
        patchState(store, {
          courseIds: updated,
          lastModified: Date.now(),
        });
        storage.setItem('favorites', updated, true);
      }
    },

    removeFromFavorites(courseId: string) {
      const updated = store.courseIds().filter((id) => id !== courseId);
      patchState(store, {
        courseIds: updated,
        lastModified: Date.now(),
      });
      storage.setItem('favorites', updated, true);
    },

    toggleFavorite(courseId: string) {
      if (store.courseIds().includes(courseId)) {
        this.removeFromFavorites(courseId);
      } else {
        this.addToFavorites(courseId);
      }
    },

    addMultipleFavorites(courseIds: string[]) {
      const currentIds = store.courseIds();
      const updated = [...new Set([...currentIds, ...courseIds])];
      patchState(store, {
        courseIds: updated,
        lastModified: Date.now(),
      });
      storage.setItem('favorites', updated, true);
    },

    clearAll() {
      patchState(store, {
        courseIds: [],
        lastModified: Date.now(),
      });
      storage.removeItem('favorites', true);
    },

    loadFromStorage() {
      const courseIds = storage.getItem<string[]>('favorites', true);
      if (courseIds) {
        patchState(store, { courseIds });
      }
    },

    reloadUserData() {
      console.log('reloadUserData');

      patchState(store, { courseIds: [] });
      this.loadFromStorage();
    },

    exportFavorites(): string[] {
      return [...store.courseIds()];
    },

    importFavorites(courseIds: string[]) {
      patchState(store, {
        courseIds: [...new Set(courseIds)],
        lastModified: Date.now(),
      });
      storage.setItem('favorites', courseIds, true);
    },

    hasFavorites(): boolean {
      return store.courseIds().length > 0;
    },
  })),
  withHooks({
    onInit(store) {
      store.loadFromStorage();
    },
  })
);
