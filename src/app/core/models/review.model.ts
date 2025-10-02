export interface Course {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  description: string;
  thumbnail: string;
  category: string;
  duration: string;
  level: CourseLevel;
  studentsCount: number;
  videoUrl?: string;
  curriculum?: CourseModule[];
  createdAt?: Date;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  videoUrl?: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CreateReviewRequest {
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'rating-asc'
  | 'rating-desc'
  | 'newest'
  | 'popular';
export type CourseLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'All Levels';
export type CourseCategory =
  | 'Web Development'
  | 'Mobile Development'
  | 'Data Science'
  | 'Machine Learning'
  | 'Design'
  | 'Business'
  | 'Marketing'
  | 'Programming';
