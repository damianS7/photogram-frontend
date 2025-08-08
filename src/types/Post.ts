import type { Comment } from "./Comment";
export interface Post {
  id: number;
  customerId: number;
  photoFilename: string;
  description: string;
  comments: Comment[];
  createdAt: string;
}
