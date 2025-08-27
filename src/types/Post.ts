export interface Post {
  id: number;
  authorId: number;
  photoFilename: string | null;
  description: string;
  createdAt: string;
}
