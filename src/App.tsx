import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './shared/store';
import { router } from './router';
import { getToastConfiguration } from './shared/utils';
import { ErrorBoundary } from './shared/components';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, 
      refetchOnMount: false, 
      staleTime: 0, 
      gcTime: 10 * 60 * 1000, 
    },
    mutations: {
      retry: 0, 
    },
  },
});

const ExpenseManagementApplication = () => {
  const toastConfiguration = useMemo(() => getToastConfiguration(), []);

  return (
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <div className="App">
              <RouterProvider router={router} />
              <Toaster {...toastConfiguration} />
            </div>
          </ErrorBoundary>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default ExpenseManagementApplication;
