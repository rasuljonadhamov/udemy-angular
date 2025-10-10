import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private getCurrentUserId(): string | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user)?.id || null : null;
    } catch {
      return null;
    }
  }

  private getUserSpecificKey(key: string): string {
    const userId = this.getCurrentUserId();
    return userId ? `${key}_${userId}` : key;
  }

  setItem(key: string, value: any, userSpecific: boolean = false): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const serialized = JSON.stringify(value);
      const storageKey = userSpecific ? this.getUserSpecificKey(key) : key;
      localStorage.setItem(storageKey, serialized);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  getItem<T>(key: string, userSpecific: boolean = false): T | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const storageKey = userSpecific ? this.getUserSpecificKey(key) : key;
      const item = localStorage.getItem(storageKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  removeItem(key: string, userSpecific: boolean = false): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const storageKey = userSpecific ? this.getUserSpecificKey(key) : key;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  clear(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localsorage', error);
    }
  }

  clearUserSpecificData(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const userId = this.getCurrentUserId();
      if (userId) {
        const keysToRemove = ['cart', 'favorites'];
        keysToRemove.forEach((key) => {
          localStorage.removeItem(`${key}_${userId}`);
        });
      }
    } catch (error) {
      console.error('Error clearing user-specific data', error);
    }
  }

  hasItem(key: string, userSpecific: boolean = false): boolean {
    if (typeof localStorage === 'undefined') return false;
    const storageKey = userSpecific ? this.getUserSpecificKey(key) : key;
    return localStorage.getItem(storageKey) !== null;
  }
}
