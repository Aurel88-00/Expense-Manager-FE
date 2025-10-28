import type { TEmptyStateProps, TErrorStateProps, TLoadingStateProps } from './interface';
import { AlertCircle } from 'lucide-react';

export const EmptyState = ({ icon: Icon, title, description, action }: TEmptyStateProps) => (
  <div className="flex items-center justify-center flex-1 w-full px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-center text-sm text-gray-600 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  </div>
);

export const ErrorState = ({
  title = 'Error loading data',
  description = 'Please try refreshing the page',
  action,
}: TErrorStateProps) => (
  <div className="flex items-center justify-center flex-1 w-[77.5vw] px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-600">{title}</h3>
      <p className="mt-2 text-center text-sm text-gray-500 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  </div>
);

export const LoadingState = ({ message = 'Loading...' }: TLoadingStateProps) => (
  <div className="flex items-center justify-center flex-1 w-[77.5vw] px-4">
    <div className="flex flex-col items-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin" />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);
