import type { Expense, SpendingInsights, BudgetForecast } from '../../../shared/lib/types';

export interface IExpenseState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  insights: SpendingInsights | null;
  forecast: BudgetForecast | null;
  loading: boolean;
  error: string | null;
}

