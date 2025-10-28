export const getToastConfiguration = () => ({
  position: 'bottom-right' as const,
  toastOptions: {
    duration: 4000,
    style: {
      background: '#ffffff',
      color: '#1f2937',
      borderRadius: '8px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      letterSpacing: '0.3px',
    },
    success: {
      duration: 3000,
      style: {
        background: '#ecfdf5',
        color: '#065f46',
        borderLeft: '4px solid #10b981',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#ecfdf5',
      },
    },
    error: {
      duration: 5000,
      style: {
        background: '#fef2f2',
        color: '#7f1d1d',
        borderLeft: '4px solid #ef4444',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fef2f2',
      },
    },
    loading: {
      style: {
        background: '#f3f4f6',
        color: '#374151',
        borderLeft: '4px solid #3b82f6',
      },
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#f3f4f6',
      },
    },
  },
});
