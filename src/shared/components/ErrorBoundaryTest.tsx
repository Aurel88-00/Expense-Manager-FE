import { useState } from 'react';

const ErrorBoundaryTest = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate error boundary functionality!');
  }

  return (
    <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">
        Error Boundary Test Component
      </h3>
      <p className="text-sm text-yellow-700 mb-3">
        This component can be used to test error boundaries. Click the button below to trigger an error.
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-800 bg-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
      >
        Trigger Error
      </button>
    </div>
  );
};

export default ErrorBoundaryTest;
