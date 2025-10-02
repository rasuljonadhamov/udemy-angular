import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Course } from '../core/models/course.model';
import { StorageService } from '../core/services/storage.service';

interface CartState {
  items: Course[];
  lastModified: number | null;
}

const initialState: CartState = {
  items: [],
  lastModified: null,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    total: computed(() =>
      store.items().reduce((sum, item) => sum + item.price, 0)
    ),

    totalWithDiscount: computed(() => {
      const total = store.items().reduce((sum, item) => sum + item.price, 0);
      const count = store.items().length;
      if (count >= 3) {
        return total * 0.9; 
      }
      return total;
    }),

    count: computed(() => store.items().length),

    isEmpty: computed(() => store.items().length === 0),

    isInCart: computed(
      () => (courseId: string) =>
        store.items().some((item) => item.id === courseId)
    ),

    courseIds: computed(() => store.items().map((item) => item.id)),

    averagePrice: computed(() => {
      const items = store.items();
      if (items.length === 0) return 0;
      return items.reduce((sum, item) => sum + item.price, 0) / items.length;
    }),

    mostExpensive: computed(() => {
      const items = store.items();
      if (items.length === 0) return null;
      return items.reduce((max, item) => (item.price > max.price ? item : max));
    }),

    savings: computed(() => {
      const items = store.items();
      const total = items.reduce((sum, item) => sum + item.price, 0);
      const count = items.length;
      if (count >= 3) {
        return total * 0.1; 
      }
      return 0;
    }),
  })),
  withMethods((store, storage = inject(StorageService)) => ({
    addToCart(course: Course) {
      const currentItems = store.items();
      if (!currentItems.some((item) => item.id === course.id)) {
        const updated = [...currentItems, course];
        patchState(store, {
          items: updated,
          lastModified: Date.now(),
        });
        storage.setItem('cart', updated);
      }
    },

    removeFromCart(courseId: string) {
      const updated = store.items().filter((item) => item.id !== courseId);
      patchState(store, {
        items: updated,
        lastModified: Date.now(),
      });
      storage.setItem('cart', updated);
    },

    addMultipleCourses(courses: Course[]) {
      const currentItems = store.items();
      const newCourses = courses.filter(
        (course) => !currentItems.some((item) => item.id === course.id)
      );
      const updated = [...currentItems, ...newCourses];
      patchState(store, {
        items: updated,
        lastModified: Date.now(),
      });
      storage.setItem('cart', updated);
    },

    clearCart() {
      patchState(store, {
        items: [],
        lastModified: Date.now(),
      });
      storage.removeItem('cart');
    },

    updateCourse(courseId: string, updates: Partial<Course>) {
      const items = store.items();
      const updated = items.map((item) =>
        item.id === courseId ? { ...item, ...updates } : item
      );
      patchState(store, {
        items: updated,
        lastModified: Date.now(),
      });
      storage.setItem('cart', updated);
    },
    loadFromStorage() {
      const items = storage.getItem<Course[]>('cart');
      if (items) {
        patchState(store, { items });
      }
    },

    getCartSummary() {
      return {
        items: store.items(),
        count: store.count(),
        total: store.total(),
        totalWithDiscount: store.totalWithDiscount(),
        savings: store.savings(),
      };
    },

    hasItems(): boolean {
      return store.items().length > 0;
    },

    getCourse(courseId: string): Course | undefined {
      return store.items().find((item) => item.id === courseId);
    },
  })),
  withHooks({
    onInit(store) {
      store.loadFromStorage();
    },
  })
);
