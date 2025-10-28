import type { BudgetStatus, ChartDataPoint, Team, UtilizationDataPoint } from '../lib/types';


export const prepareBudgetChartData = (budgetStatuses: readonly BudgetStatus[]): readonly ChartDataPoint[] => 
  budgetStatuses.map(status => ({
    name: status.teamName,
    budget: status.budget,
    spent: status.currentSpending,
    remaining: status.remainingBudget
  }));


export const prepareUtilizationChartData = (budgetStatuses: readonly BudgetStatus[]): readonly UtilizationDataPoint[] => 
  budgetStatuses.map(status => ({
    name: status.teamName,
    utilization: status.utilizationPercentage
  }));


export const calculateDashboardStatistics = (
  teams: Team[],
  budgetStatuses: BudgetStatus[]
): {
  totalTeams: number;
  totalBudget: number;
  totalSpent: number;
  overBudgetTeams: number;
  nearBudgetTeams: number;
} => {
  const totalBudget = teams.reduce((sum, team) => sum + team.budget, 0);
  const totalSpent = budgetStatuses.reduce((sum, status) => sum + status.currentSpending, 0);
  const overBudgetTeams = budgetStatuses.filter(status => status.isOverBudget).length;
  const nearBudgetTeams = budgetStatuses.filter(status => status.isNearBudget && !status.isOverBudget).length;

  return {
    totalTeams: teams.length,
    totalBudget,
    totalSpent,
    overBudgetTeams,
    nearBudgetTeams
  };
};
