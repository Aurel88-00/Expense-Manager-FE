import { api } from '../../../shared/services/apiConfig';
import type { Team, BudgetStatus, Expense } from '../../../shared/lib/types';


export const teamApi = {
  getAll: () => api.get<{ success: boolean; teams: Team[] }>('/teams'),
  getById: (id: string) => api.get<{ success: boolean; team: Team }>(`/teams/${id}`),
  create: (data: Partial<Team>) => api.post<{ success: boolean; team: Team }>('/teams', data),
  update: (id: string, data: Partial<Team>) => api.put<{ success: boolean; team: Team }>(`/teams/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/teams/${id}`),
  getBudgetStatus: (id: string) => api.get<{ success: boolean; budgetStatus: BudgetStatus }>(`/teams/${id}/budget-status`),
  getExpenses: (id: string, params?: Record<string, string | number>) => api.get<{ success: boolean; expenses: Expense[]; pagination: Record<string, unknown> }>(`/teams/${id}/expenses`, { params }),
};

export default teamApi;
