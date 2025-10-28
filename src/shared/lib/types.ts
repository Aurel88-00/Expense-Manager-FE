// Core entity types
export interface Team {
  _id: string;
  name: string;
  budget: number;
  currentSpending: number;
  members: TeamMember[];
  budgetAlerts: {
    eightyPercentSent: boolean;
    hundredPercentSent: boolean;
  };
  createdAt: string;
  updatedAt: string;
  budgetUtilization?: number;
  remainingBudget?: number;
}

export interface TeamMember {
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface Expense {
  _id: string;
  team: string | Team;
  description: string;
  amount: number;
  category: string;
  aiSuggestedCategory?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: {
    name: string;
    email: string;
  };
  approvedBy?: {
    name: string;
    email: string;
    approvedAt: string;
  };
  date: string;
  isDuplicate?: boolean;
  duplicateReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics and insights types
export interface BudgetStatus {
  teamId: string;
  teamName: string;
  budget: number;
  currentSpending: number;
  remainingBudget: number;
  utilizationPercentage: number;
  isOverBudget: boolean;
  isNearBudget: boolean;
  alertStatus: {
    eightyPercentSent: boolean;
    hundredPercentSent: boolean;
  };
}

export interface SpendingInsights {
  summary: string;
  topCategory: string;
  trends: string;
  recommendations: string[];
  budgetHealth: string;
  totalSpent: number;
  budgetUtilization: number;
  categoryBreakdown: Record<string, number>;
}

export interface BudgetForecast {
  willExceedBudget: boolean;
  confidence: number;
  predictedOverspend: number;
  monthsToExceed: number;
  recommendations: string[];
  averageMonthlySpending: number;
  currentUtilization: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form data types
export interface CreateTeamData {
  name: string;
  budget: number;
  members: Omit<TeamMember, 'role'>[];
}

export type UpdateTeamData = Partial<CreateTeamData>;

export interface CreateExpenseData {
  team: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {
  status?: 'pending' | 'approved' | 'rejected';
}

// Bulk action types
export interface BulkActionData {
  expenseIds: string[];
  action: 'approve' | 'reject';
  approvedBy: {
    name: string;
    email: string;
  };
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}

// Component-specific types
export interface NavigationItem {
  readonly name: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

export interface DashboardStats {
  readonly totalTeams: number;
  readonly totalBudget: number;
  readonly totalSpent: number;
  readonly overBudgetTeams: number;
  readonly nearBudgetTeams: number;
}

export interface ChartDataPoint {
  readonly name: string;
  readonly budget: number;
  readonly spent: number;
  readonly remaining: number;
}

export interface UtilizationDataPoint {
  readonly name: string;
  readonly utilization: number;
}

export type TActiveTab = 'overview' | 'expenses' | 'insights' | string;