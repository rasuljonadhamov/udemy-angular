import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthStore } from './store/auth.store';
import { CoursesStore } from './store/courses.store';
import { CourseCardComponent } from './shared/components/course-card/course-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseCardComponent],
  template: `
    <div class="home">
      <section class="hero">
        <div class="container">
          <h1>Learn Without Limits</h1>
          <p>Start, switch, or advance your career with thousands of courses</p>
          @if (!authStore.isAuthenticated()) {
          <div class="hero-actions">
            <a routerLink="/register" class="btn btn-primary">Get Started</a>
            <a routerLink="/login" class="btn btn-secondary">Sign In</a>
          </div>
          } @else {
          <div class="hero-actions">
            <a routerLink="/courses" class="btn btn-primary">Browse Courses</a>
            @if (authStore.purchasedCoursesCount() > 0) {
            <a routerLink="/my-learning" class="btn btn-secondary">My Learning</a>
            }
          </div>
          }
        </div>
      </section>

      @if (coursesStore.courses().length > 0) {
      <section class="featured-courses">
        <div class="container">
          <h2>Featured Courses</h2>
          <div class="courses-grid">
            @for (course of featuredCourses; track (course._id || course.id)) {
            <app-course-card
              [course]="course"
              [showActions]="authStore.isAuthenticated()"
            />
            }
          </div>
          <div class="text-center">
            <a routerLink="/courses" class="btn btn-outline"
              >View All Courses</a
            >
          </div>
        </div>
      </section>
      }

      <section class="stats">
        <div class="container">
          <div class="stats-grid">
            <div class="stat">
              <h3>{{ coursesStore.totalCourses() }}</h3>
              <p>Courses Available</p>
            </div>
            <div class="stat">
              <h3>
                {{
                  authStore.isAuthenticated()
                    ? authStore.purchasedCoursesCount()
                    : '0'
                }}
              </h3>
              <p>Your Courses</p>
            </div>
            <div class="stat">
              <h3>{{ coursesStore.categories().length }}</h3>
              <p>Categories</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .hero {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4rem 0;
        text-align: center;
      }
      .hero h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .hero p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
      }
      .hero-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }
      .featured-courses {
        padding: 4rem 0;
      }
      .featured-courses h2 {
        text-align: center;
        margin-bottom: 2rem;
      }
      .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }
      .stats {
        background: #f8f9fa;
        padding: 4rem 0;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        text-align: center;
      }
      .stat h3 {
        font-size: 2.5rem;
        color: #667eea;
        margin-bottom: 0.5rem;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        text-decoration: none;
        border-radius: 4px;
        font-weight: 500;
        transition: all 0.3s;
      }
      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-secondary {
        background: transparent;
        color: white;
        border: 2px solid white;
      }
      .btn-outline {
        background: transparent;
        color: #667eea;
        border: 2px solid #667eea;
      }
      .text-center {
        text-align: center;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  authStore = inject(AuthStore);
  coursesStore = inject(CoursesStore);

  get featuredCourses() {
    return this.coursesStore
      .courses()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }

  ngOnInit() {
    if (this.coursesStore.courses().length === 0) {
      this.coursesStore.loadCourses();
    }
  }
}
