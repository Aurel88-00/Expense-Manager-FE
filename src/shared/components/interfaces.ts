import type { ErrorInfo, ReactNode } from 'react';

// ErrorBoundary
export interface TErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface TErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}


export interface TPageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
  onRetry?: () => void;
}

export interface TPageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface TComponentErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
}

export interface TComponentErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

