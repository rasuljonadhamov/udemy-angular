import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, shareReplay, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Course,
  Review,
  CreateReviewRequest,
  PurchaseResponse,
  SortOption,
} from '../models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/courses`;

  private coursesCache$: Observable<Course[]> | null = null;

  getAllCourses(refresh: boolean = false): Observable<Course[]> {
    if (!this.coursesCache$ || refresh) {
      this.coursesCache$ = this.http
        .get<Course[]>(this.apiUrl)
        .pipe(retry(2), shareReplay(1), catchError(this.handleError));
    }
    return this.coursesCache$;
  }

  getCourseById(id: string): Observable<Course> {
    return this.http
      .get<Course>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getCoursesByCategory(category: string): Observable<Course[]> {
    const params = new HttpParams().set('category', category);
    return this.http
      .get<Course[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  searchCourses(query: string): Observable<Course[]> {
    const params = new HttpParams().set('search', query);
    return this.http
      .get<Course[]>(`${this.apiUrl}/search`, { params })
      .pipe(catchError(this.handleError));
  }

  getCourseReviews(courseId: string): Observable<Review[]> {
    return this.http
      .get<Review[]>(`${this.apiUrl}/${courseId}/reviews`)
      .pipe(catchError(this.handleError));
  }

  addReview(review: CreateReviewRequest): Observable<Review> {
    return this.http
      .post<Review>(`${environment.apiUrl}/reviews`, review)
      .pipe(catchError(this.handleError));
  }

  purchaseCourse(courseId: string): Observable<PurchaseResponse> {
    return this.http
      .post<PurchaseResponse>(`${this.apiUrl}/${courseId}/purchase`, {})
      .pipe(catchError(this.handleError));
  }

  purchaseMultipleCourses(courseIds: string[]): Observable<PurchaseResponse> {
    return this.http
      .post<PurchaseResponse>(`${this.apiUrl}/purchase-multiple`, { courseIds })
      .pipe(catchError(this.handleError));
  }

  getPurchasedCourses(): Observable<Course[]> {
    return this.http
      .get<Course[]>(`${this.apiUrl}/purchased`)
      .pipe(catchError(this.handleError));
  }

  getRecommendedCourses(limit: number = 4): Observable<Course[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http
      .get<Course[]>(`${this.apiUrl}/recommended`, { params })
      .pipe(catchError(this.handleError));
  }

  clearCache(): void {
    this.coursesCache$ = null;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    console.error('Course Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
