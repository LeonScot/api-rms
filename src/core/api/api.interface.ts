export interface ApiResponse<T> {
    status: 'success' | 'error';
    data: T;
    message: string;
    totalCount?: number;
}

export function Response<T>(status: 'success' | 'error', data: T, message: string, totalCount?: number): ApiResponse<T> {
    return {
      status,
      data,
      message,
      totalCount
    };
  }