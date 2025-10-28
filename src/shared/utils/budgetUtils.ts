import type { Team, BudgetStatus } from '../lib/types';


export const getBudgetStatusColor = (budgetStatus: BudgetStatus): string => {
  if (budgetStatus.isOverBudget) return '#ef4444'; 
  if (budgetStatus.isNearBudget) return '#f59e0b'; 
  return '#10b981'; 
};


export const getBudgetStatusText = (budgetStatus: BudgetStatus): string => {
  if (budgetStatus.isOverBudget) return 'Over Budget';
  if (budgetStatus.isNearBudget) return 'Near Budget';
  return 'On Track';
};


export const getTeamBudgetStatusColor = (team: Team): string => {
  const utilization = (team.currentSpending / team.budget) * 100;
  if (utilization >= 100) return 'text-red-600';
  if (utilization >= 80) return 'text-yellow-600';
  return 'text-green-600';
};


export const getTeamBudgetStatusText = (team: Team): string => {
  const utilization = (team.currentSpending / team.budget) * 100;
  if (utilization >= 100) return 'Over Budget';
  if (utilization >= 80) return 'Near Budget';
  return 'On Track';
};


export const calculateBudgetUtilization = (currentSpending: number, budget: number): number => {
  return (currentSpending / budget) * 100;
};


export const isOverBudget = (currentSpending: number, budget: number): boolean => {
  return currentSpending >= budget;
};


export const isNearBudget = (currentSpending: number, budget: number): boolean => {
  const utilization = calculateBudgetUtilization(currentSpending, budget);
  return utilization >= 80 && utilization < 100;
};
