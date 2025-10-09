import { Pipe, PipeTransform } from '@angular/core';
import { Course, SortOption } from '../../core/models/course.model';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(courses: Course[], sortOption: SortOption): Course[] {
    if (!courses || !sortOption) {
      return courses;
    }

    const sorted = [...courses];

    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating-asc':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
      case 'popular':
        return sorted.sort((a, b) => b.studentsCount - a.studentsCount);
      default:
        return sorted;
    }
  }
}
