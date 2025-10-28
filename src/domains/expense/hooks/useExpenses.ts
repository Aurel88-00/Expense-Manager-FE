import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseApi } from '../services/expenseApi';
import type { Expense, BulkActionData } from '../../../shared/lib/types';
import toast from 'react-hot-toast';

export const useExpenses = (params?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const response = await expenseApi.getAll(params);
      return response.data.expenses ?? [];
    },
    staleTime: 0, 
    gcTime: 10 * 60 * 1000, 
  });
};

export const useExpenseById = (expenseId: string) => {
  return useQuery({
    queryKey: ['expenses', expenseId],
    queryFn: async () => {
      const response = await expenseApi.getById(expenseId);
      if (!response.data.expense) {
        throw new Error('Expense not found');
      }
      return response.data.expense;
    },
    staleTime: 0, 
    gcTime: 10 * 60 * 1000,
    enabled: !!expenseId,
  });
};

export const useSpendingInsights = (teamId: string) => {
  return useQuery({
    queryKey: ['insights', teamId],
    queryFn: async () => {
      const response = await expenseApi.getInsights(teamId);
      if (!response.data.insights) {
        throw new Error('Insights not available');
      }
      return response.data.insights;
    },
    staleTime: 0, 
    gcTime: 30 * 60 * 1000,
    enabled: !!teamId,
  });
};

export const useBudgetForecast = (teamId: string) => {
  return useQuery({
    queryKey: ['forecast', teamId],
    queryFn: async () => {
      const response = await expenseApi.getForecast(teamId);
      if (!response.data.forecast) {
        throw new Error('Forecast not available');
      }
      return response.data.forecast;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!teamId,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Expense>) => {
      const response = await expenseApi.create(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueriesData({ queryKey: ['expenses'] }, (old: unknown) => {
        if (!Array.isArray(old)) {
          return [data.expense];
        }
        return [data.expense, ...old]; 
      });
      
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      
      // Force refetch team data to update spending
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.refetchQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['budgetStatus'] });
      queryClient.refetchQueries({ queryKey: ['budgetStatus'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['forecast'] });
      
      toast.success('Expense created successfully!');
    },
    onError: () => {
      toast.error('Failed to create expense');
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Expense> }) => {
      console.log('[useUpdateExpense] Sending update request:', { id, data });
      const response = await expenseApi.update(id, data);
      console.log('[useUpdateExpense] Response received:', response);
      console.log('[useUpdateExpense] Response.data:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('[useUpdateExpense] onSuccess called with:', data);
      
      if (!data || !data.expense) {
        console.error('[useUpdateExpense] Invalid response structure:', data);
        toast.error('Invalid response from server');
        return;
      }
      
      queryClient.setQueriesData({ queryKey: ['expenses'] }, (old: unknown) => {
        if (!Array.isArray(old)) {
          return [data.expense];
        }
        return old.map(expense => 
          expense._id === data.expense._id ? data.expense : expense
        );
      });
      
        queryClient.setQueryData(['expenses', data.expense._id], data.expense);
        
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
     
        queryClient.invalidateQueries({ queryKey: ['teams'] });
        queryClient.refetchQueries({ queryKey: ['teams'] });
        queryClient.invalidateQueries({ queryKey: ['budgetStatus'] });
        queryClient.refetchQueries({ queryKey: ['budgetStatus'] });
        queryClient.invalidateQueries({ queryKey: ['insights'] });
        queryClient.invalidateQueries({ queryKey: ['forecast'] });
        
        toast.success('Expense updated successfully!');
    },
    onError: (error: unknown) => {
      console.error('[useUpdateExpense] onError called with:', error);
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await expenseApi.delete(id);
      console.log('Response data:', response.data);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['expenses'] });
      
      
      const previousExpenses = queryClient.getQueriesData({ queryKey: ['expenses'] });
      
      queryClient.setQueriesData({ queryKey: ['expenses'] }, (old: unknown) => {
        if (!Array.isArray(old)) {
          return [];
        }
        return old.filter(expense => expense._id !== id);
      });
      
      return { previousExpenses };
    },
    onSuccess: (id) => {      
      queryClient.removeQueries({ queryKey: ['expenses', id] });   
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.refetchQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['budgetStatus'] });
      queryClient.refetchQueries({ queryKey: ['budgetStatus'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['forecast'] });
      
      toast.success('Expense deleted successfully!');
    },
    onError: (error: unknown, _id, context) => {
      console.error('Error deleting expense:', error);
      
      if (context?.previousExpenses) {
        context.previousExpenses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }     
    },
  });
};

export const useBulkAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkActionData) => {
      const response = await expenseApi.bulkAction(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['budgetStatus'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['forecast'] });
      
      toast.success('Bulk action completed successfully!');
    },
    onError: () => {
      toast.error('Failed to perform bulk action');
    },
  });
};
