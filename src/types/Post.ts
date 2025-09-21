export interface Post {
  id: number;
  authorId: number;
  imageFilename: string | null;
  description: string;
  createdAt: string;
}
