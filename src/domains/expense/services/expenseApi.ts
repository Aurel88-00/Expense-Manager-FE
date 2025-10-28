import { api } from '../../../shared/services/apiConfig';
import type { Expense, SpendingInsights, BudgetForecast, BulkActionData, BulkActionResponse } from '../../../shared/lib/types';

export const expenseApi = {
  getAll: (params?: Record<string, string | number>) => api.get<{ success: boolean; expenses: Expense[]; pagination: Record<string, unknown> }>('/expenses', { params }),
  getById: (id: string) => api.get<{ success: boolean; expense: Expense }>(`/expenses/${id}`),
  create: (data: Partial<Expense>) => api.post<{ success: boolean; expense: Expense; aiSuggestion?: Record<string, unknown>; duplicateWarning?: Record<string, unknown> }>('/expenses', data),
  update: (id: string, data: Partial<Expense>) => api.put<{ success: boolean; expense: Expense }>(`/expenses/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/expenses/${id}`),
  getInsights: (teamId: string) => api.get<{ success: boolean; insights: SpendingInsights }>(`/expenses/${teamId}/insights`),
  getForecast: (teamId: string) => api.get<{ success: boolean; forecast: BudgetForecast }>(`/expenses/${teamId}/forecast`),
  bulkAction: (data: BulkActionData) => 
    api.post<BulkActionResponse>('/expenses/bulk-action', data),
};

export default expenseApi;
