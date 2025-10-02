import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { Course, SortOption } from '../../../core/models/course.model';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';
import { AuthStore } from '../../../store/auth.store';
import { CoursesStore } from '../../../store/courses.store';


@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
})
export class CourseListComponent implements OnInit {
  private courseService = inject(CourseService);
  authStore = inject(AuthStore);
  coursesStore = inject(CoursesStore);

  searchQuery = signal('');
  sortOption = signal<SortOption>('rating-desc');

  filteredAndSortedCourses = computed(() => {
    const courses = this.coursesStore.courses();
    const query = this.searchQuery();
    const sort = this.sortOption();
    
    return courses
      .filter(course => 
        !query || 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.author.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        switch (sort) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'rating-asc': return a.rating - b.rating;
          case 'rating-desc': return b.rating - a.rating;
          default: return 0;
        }
      });
  });

  ngOnInit() {
    this.coursesStore.loadCourses();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  onSortChange(sort: SortOption) {
    this.sortOption.set(sort);
  }
}
