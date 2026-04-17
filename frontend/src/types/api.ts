export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  detail: string;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}