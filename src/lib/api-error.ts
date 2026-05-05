import axios from 'axios';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const mapApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    
    if (data?.detail) {
      return { message: data.detail };
    }
    
    if (typeof data === 'object' && data !== null) {
      // Handle field-specific validation errors
      return { 
        message: 'Validation failed', 
        errors: data as Record<string, string[]> 
      };
    }
    
    return { message: error.message || 'An unexpected error occurred' };
  }
  
  return { message: error instanceof Error ? error.message : 'An unexpected error occurred' };
};
