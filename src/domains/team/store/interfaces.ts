import type { Team, BudgetStatus } from '../../../shared/lib/types';

export interface ITeamState {
  teams: Team[];
  selectedTeam: Team | null;
  budgetStatuses: BudgetStatus[];
  loading: boolean;
  error: string | null;
}

