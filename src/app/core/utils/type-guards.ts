import { Course, Review } from '../models/course.model';
import { User } from '../models/user.model';

export function isCourse(obj: any): obj is Course {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
}

export function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
}

export function isReview(obj: any): obj is Review {
  return obj && typeof obj.id === 'string' && typeof obj.rating === 'number';
}

export function isError(error: any): error is Error {
  return error instanceof Error;
}
