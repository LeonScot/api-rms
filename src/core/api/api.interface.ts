export interface ApiResponse<T> {
    status: 'success' | 'error';
    data: T;
    message: string;
    totalCount?: number;
}

export const Response = {
  OK<T>(data: T, message: string, totalCount?: number): ApiResponse<T> {
    return {
      status: 'success',
      data,
      message,
      totalCount
    };
  },

  Error<T>(message: string): ApiResponse<T> {
    return {
      status: 'error',
      data: null,
      message,
    };
  },
};

export interface IPagination { pageNumber: number; limit: number, search?: string }
export interface ISort { field: string; order: 'asc' | 'desc' }