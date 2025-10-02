import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { Course, SortOption } from '../core/models/course.model';
import { CourseService } from '../core/services/course.service';

interface CoursesState {
  courses: Course[];
  selectedCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortOption: SortOption;
  selectedCategory: string | null;
}

const initialState: CoursesState = {
  courses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  sortOption: 'rating-desc',
  selectedCategory: null,
};

export const CoursesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredCourses: computed(() => {
      let courses = store.courses();

      const query = store.searchQuery().toLowerCase().trim();
      if (query) {
        courses = courses.filter(
          (course) =>
            course.title.toLowerCase().includes(query) ||
            course.author.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)
        );
      }

      const category = store.selectedCategory();
      if (category) {
        courses = courses.filter((course) => course.category === category);
      }

      const sort = store.sortOption();
      courses = [...courses].sort((a, b) => {
        switch (sort) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating-asc':
            return a.rating - b.rating;
          case 'rating-desc':
            return b.rating - a.rating;
          case 'popular':
            return b.studentsCount - a.studentsCount;
          default:
            return 0;
        }
      });

      return courses;
    }),

    totalCourses: computed(() => store.courses().length),
    filteredCount: computed(() => {
      let courses = store.courses();
      const query = store.searchQuery().toLowerCase().trim();
      if (query) {
        courses = courses.filter(
          (course) =>
            course.title.toLowerCase().includes(query) ||
            course.author.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)
        );
      }
      const category = store.selectedCategory();
      if (category) {
        courses = courses.filter((course) => course.category === category);
      }
      return courses.length;
    }),

    categories: computed(() => {
      const cats = store.courses().map((c) => c.category);
      return [...new Set(cats)].sort();
    }),

    priceRange: computed(() => {
      const courses = store.courses();
      if (courses.length === 0) return { min: 0, max: 0 };
      const prices = courses.map((c) => c.price);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    }),
  })),
  withMethods((store, courseService = inject(CourseService)) => ({
    async loadCourses() {
      patchState(store, { isLoading: true, error: null });

      courseService.getAllCourses().subscribe({
        next: (courses) => {
          patchState(store, { courses, isLoading: false });
        },
        error: (error) => {
          patchState(store, {
            error: error.message,
            isLoading: false,
          });
        },
      });
    },

    setSearchQuery(query: string) {
      patchState(store, { searchQuery: query });
    },

    setSortOption(option: SortOption) {
      patchState(store, { sortOption: option });
    },

    setCategory(category: string | null) {
      patchState(store, { selectedCategory: category });
    },

    selectCourse(course: Course | null) {
      patchState(store, { selectedCourse: course });
    },

    clearFilters() {
      patchState(store, {
        searchQuery: '',
        selectedCategory: null,
        sortOption: 'rating-desc',
      });
    },
  }))
);
