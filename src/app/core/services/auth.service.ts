import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private apiUrl = `${environment.apiUrl}/auth`;

  private authStateSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  authState$ = this.authStateSubject.asObservable();

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.setSession(response);
          this.authStateSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((response) => {
        this.setSession(response);
        this.authStateSubject.next(true);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('user');
    this.storage.removeItem('tokenExpiry');
    this.authStateSubject.next(false);
  }

  isAuthenticated(): boolean {
    const token = this.storage.getItem<string>('token');
    const expiry = this.storage.getItem<number>('tokenExpiry');

    if (!token || !expiry) {
      return false;
    }

    const expiryTime = Number(expiry);
    if (Number.isFinite(expiryTime) && Date.now() >= expiryTime) {
      this.logout();
      return false;
    }

    return true;
  }

  getCurrentUser(): User | null {
    return this.storage.getItem<User>('user');
  }

  getToken(): string | null {
    return this.storage.getItem<string>('token');
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}).pipe(
      tap((response) => {
        this.setSession(response);
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUserFromServer(): Observable<{ user: User }> {
    return this.http
      .get<{ user: User }>(`${this.apiUrl}/me`)
      .pipe(catchError(this.handleError));
  }

  private setSession(authResult: AuthResponse): void {
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.storage.setItem('token', authResult.token);
    this.storage.setItem('user', authResult.user);
    this.storage.setItem('tokenExpiry', expiresAt);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
