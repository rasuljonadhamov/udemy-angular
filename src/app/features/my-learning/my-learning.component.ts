import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [CommonModule, RouterLink, CourseCardComponent],
  templateUrl: './my-learning.component.html',
  styleUrl: './my-learning.component.css',
})
export class MyLearningComponent implements OnInit {
  private courseService = inject(CourseService);

  isLoading = signal(true);
  courses = signal<Course[]>([]);
  error = signal('');

  ngOnInit() {
    this.courseService.getPurchasedCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load your courses');
        this.isLoading.set(false);
      }
    });
  }
}
