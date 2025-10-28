import { Component } from 'react';
import type { ErrorInfo } from 'react';
import type { TComponentErrorBoundaryProps, TComponentErrorBoundaryState } from './interfaces';
import { AlertTriangle } from 'lucide-react';

class ComponentErrorBoundary extends Component<TComponentErrorBoundaryProps, TComponentErrorBoundaryState> {
  constructor(props: TComponentErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TComponentErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in component ${this.props.componentName || 'Unknown'}:`, error, errorInfo);
    
    this.setState({
      error,
    });
  }

  render() {
    if (this.state.hasError) {
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                {this.props.componentName ? `${this.props.componentName} Error` : 'Component Error'}
              </h3>
              <p className="text-sm text-red-700 mt-1">
                This component encountered an error and couldn't render properly.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <p className="text-xs text-red-600 mt-2 font-mono">
                  {this.state.error.message}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
