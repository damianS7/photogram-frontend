export interface ApiResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
