import { Component } from 'react';
import type { ErrorInfo } from 'react';
import type { TPageErrorBoundaryProps, TPageErrorBoundaryState } from './interfaces';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class PageErrorBoundary extends Component<TPageErrorBoundaryProps, TPageErrorBoundaryState> {
  constructor(props: TPageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TPageErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.pageName || 'page'}:`, error, errorInfo);
    
    this.setState({
      error,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  {this.props.pageName ? `${this.props.pageName} Error` : 'Page Error'}
                </h2>

              
                <p className="text-sm text-gray-600 mb-6">
                  Something went wrong while loading this page. Please try refreshing or go back to the previous page.
                </p>

                {import.meta.env.DEV && this.state.error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-left">
                    <h3 className="text-xs font-medium text-red-800 mb-1">
                      Error Details:
                    </h3>
                    <p className="text-xs text-red-700 font-mono break-all">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
