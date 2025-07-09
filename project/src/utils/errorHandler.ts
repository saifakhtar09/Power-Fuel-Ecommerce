import toast from 'react-hot-toast';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class ErrorHandler {
  static handle(error: any, context?: string): void {
    console.error(`Error in ${context || 'Application'}:`, error);

    let message = 'An unexpected error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Handle specific error types
    if (error?.code === 'auth/user-not-found') {
      message = 'User not found. Please check your credentials.';
    } else if (error?.code === 'auth/wrong-password') {
      message = 'Invalid password. Please try again.';
    } else if (error?.code === 'auth/email-already-in-use') {
      message = 'Email already in use. Please use a different email.';
    } else if (error?.code === 'auth/weak-password') {
      message = 'Password is too weak. Please use a stronger password.';
    } else if (error?.code === 'auth/invalid-email') {
      message = 'Invalid email address.';
    } else if (error?.code === 'PGRST301') {
      message = 'Database connection error. Please try again.';
    } else if (error?.statusCode === 404) {
      message = 'Resource not found.';
    } else if (error?.statusCode === 500) {
      message = 'Server error. Please try again later.';
    }

    toast.error(message, {
      duration: 5000,
      position: 'top-right',
    });
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, context);
      return null;
    }
  }
}

export const handleAsyncError = (error: any, context?: string) => {
  ErrorHandler.handle(error, context);
};