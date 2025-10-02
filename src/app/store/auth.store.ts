import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../core/models/user.model';
import { StorageService } from '../core/services/storage.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginTime: number | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLoginTime: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    userName: computed(() => store.user()?.name || 'Guest'),
    userEmail: computed(() => store.user()?.email || ''),
    userInitials: computed(() => {
      const name = store.user()?.name;
      if (!name) return '?';
      const parts = name.split(' ');
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name[0].toUpperCase();
    }),
    hasPurchasedCourses: computed(
      () => (store.user()?.purchasedCourses?.length || 0) > 0
    ),
    purchasedCoursesCount: computed(
      () => store.user()?.purchasedCourses?.length || 0
    ),
    sessionDuration: computed(() => {
      const lastLogin = store.lastLoginTime();
      if (!lastLogin) return 0;
      return Math.floor((Date.now() - lastLogin) / 1000 / 60); // minutes
    }),
  })),
  withMethods(
    (store, router = inject(Router), storage = inject(StorageService)) => ({
      login(user: User, token: string) {
        const loginTime = Date.now();
        patchState(store, {
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastLoginTime: loginTime,
        });
        storage.setItem('token', token);
        storage.setItem('user', user);
        storage.setItem('lastLoginTime', loginTime);
      },

      logout() {
        patchState(store, {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          lastLoginTime: null,
        });
        storage.removeItem('token');
        storage.removeItem('user');
        storage.removeItem('lastLoginTime');
        router.navigate(['/login']);
      },

      setLoading(isLoading: boolean) {
        patchState(store, { isLoading });
      },

      setError(error: string | null) {
        patchState(store, { error, isLoading: false });
      },

      updateUser(user: Partial<User>) {
        const currentUser = store.user();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...user };
          patchState(store, { user: updatedUser });
          storage.setItem('user', updatedUser);
        }
      },

      addPurchasedCourse(courseId: string) {
        const currentUser = store.user();
        if (currentUser) {
          const purchasedCourses = [
            ...(currentUser.purchasedCourses || []),
            courseId,
          ];
          const updatedUser = { ...currentUser, purchasedCourses };
          patchState(store, { user: updatedUser });
          storage.setItem('user', updatedUser);
        }
      },

      addPurchasedCourses(courseIds: string[]) {
        const currentUser = store.user();
        if (currentUser) {
          const existingCourses = currentUser.purchasedCourses || [];
          const purchasedCourses = [
            ...new Set([...existingCourses, ...courseIds]),
          ];
          const updatedUser = { ...currentUser, purchasedCourses };
          patchState(store, { user: updatedUser });
          storage.setItem('user', updatedUser);
        }
      },
      // hasPurchasedCourse
      hasPurchasedCourse(courseId: string): boolean {
        return store.user()?.purchasedCourses?.includes(courseId) || false;
      },

      loadFromStorage() {
        const token = storage.getItem<string>('token');
        const user = storage.getItem<User>('user');
        const lastLoginTime = storage.getItem<number>('lastLoginTime');

        if (token && user) {
          patchState(store, {
            user,
            token,
            isAuthenticated: true,
            lastLoginTime,
          });
        }
      },

      clearError() {
        patchState(store, { error: null });
      },

      reset() {
        patchState(store, initialState);
      },
    })
  ),
  withHooks({
    onInit(store) {
      store.loadFromStorage();
    },
  })
);
