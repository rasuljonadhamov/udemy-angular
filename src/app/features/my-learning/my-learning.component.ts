import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect,
  EffectRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthStore } from '../../store/auth.store';
import { Course } from '../../core/models/course.model';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule, RouterLink, CourseCardComponent],
  templateUrl: './my-learning.component.html',
  styleUrl: './my-learning.component.css',
})
export class MyLearningComponent implements OnInit, OnDestroy {
  private courseService = inject(CourseService);
  private authStore = inject(AuthStore);
  private destroyEffect: EffectRef | null = null;

  isLoading = signal(true);
  courses = signal<Course[]>([]);
  error = signal('');

  ngOnInit() {
    this.loadPurchasedCourses();

    this.destroyEffect = effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.loadPurchasedCourses();
      }
    });
  }

  ngOnDestroy() {
    if (this.destroyEffect) {
      this.destroyEffect.destroy();
    }
  }

  private loadPurchasedCourses() {
    this.isLoading.set(true);
    this.error.set('');

    this.courseService.getPurchasedCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load your courses');
        this.isLoading.set(false);
      },
    });
  }
}
