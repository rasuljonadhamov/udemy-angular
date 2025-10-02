import { Course } from "./course.model";

export interface CartItem {
  course: Course;
  addedAt: Date;
}

export interface CartState {
  items: Course[];
  total: number;
  count: number;
}

export interface PurchaseRequest {
  courseIds: string[];
  totalAmount: number;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  purchasedCourses: string[];
}
