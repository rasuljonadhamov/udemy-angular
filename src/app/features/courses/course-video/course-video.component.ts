import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { AuthStore } from '../../../store/auth.store';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-course-video',
  standalone: true,
  imports: [CommonModule, RouterLink, SafeUrlPipe],
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
  selectedLesson = signal<any>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(id);
    }
  }

  loadCourse(id: string) {
    this.isLoading.set(true);
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course.set(course);
        this.isLoading.set(false);

        const isPurchased = this.authStore
          .user()
          ?.purchasedCourses?.includes(id);
        if (!isPurchased && course.curriculum) {
          const firstPreviewLesson = this.getFirstPreviewLesson(
            course.curriculum
          );
          if (firstPreviewLesson) {
            this.selectedLesson.set(firstPreviewLesson);
          }
        }
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.isLoading.set(false);
      },
    });
  }

  getFirstPreviewLesson(curriculum: any[]): any {
    for (const module of curriculum) {
      for (const lesson of module.lessons) {
        if (lesson.isPreview) {
          return lesson;
        }
      }
    }
    return null;
  }

  selectLesson(lesson: any) {
    const isPurchased = this.authStore
      .user()
      ?.purchasedCourses?.includes(this.course()?.id || '');

    if (!lesson.isPreview && !isPurchased) {
      this.router.navigate(['/courses', this.course()?.id]);
      return;
    }

    this.selectedLesson.set(lesson);
  }

  canAccessLesson(lesson: any): boolean {
    const isPurchased = this.authStore
      .user()
      ?.purchasedCourses?.includes(this.course()?.id || '');
    return lesson.isPreview || isPurchased;
  }
}
