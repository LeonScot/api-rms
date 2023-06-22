export interface ApiResponse<T> {
    status: 'success' | 'error';
    data: T;
    message: string;
}

export function Response<T>(status: 'success' | 'error', data: T, message: string): ApiResponse<T> {
    return {
      status,
      data,
      message,
    };
  }