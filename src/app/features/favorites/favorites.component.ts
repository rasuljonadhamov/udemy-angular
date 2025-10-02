import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesStore } from '../../store/favorites.store';
import { CoursesStore } from '../../store/courses.store';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  private favoritesStore = inject(FavoritesStore);
  private coursesStore = inject(CoursesStore);

  favoriteCourses = computed(() => {
    const favoriteIds = this.favoritesStore.courseIds();
    return this.coursesStore.courses().filter((course) =>
      favoriteIds.includes(course._id || course.id || '')
    );
  });

  ngOnInit() {
    if (this.coursesStore.courses().length === 0) {
      this.coursesStore.loadCourses();
    }
  }

  get isLoading() {
    return this.coursesStore.isLoading();
  }
}
