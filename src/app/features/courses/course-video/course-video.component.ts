import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-course-video',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-video.component.html',
  styleUrl: './course-video.component.css',
})
export class CourseVideoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private authStore = inject(AuthStore);

  course = signal<Course | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(id);
    }
  }

  loadCourse(id: string) {
    const isPurchased = this.authStore.user()?.purchasedCourses?.includes(id);

    if (!isPurchased) {
      this.router.navigate(['/courses', id]);
      return;
    }

    this.isLoading.set(true);
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course.set(course);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.isLoading.set(false);
      },
    });
  }
}
