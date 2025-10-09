import { Pipe, PipeTransform } from '@angular/core';
import { Course } from '../../core/models/course.model';

@Pipe({
  name: 'searchFilter',
  standalone: true,
})
export class SearchFilterPipe implements PipeTransform {
  transform(courses: Course[], searchTerm: string): Course[] {
    if (!courses || !searchTerm) {
      return courses;
    }

    const term = searchTerm.toLowerCase().trim();

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.author.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term)
    );
  }
}
