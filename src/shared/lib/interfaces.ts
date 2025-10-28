import type { Team, Expense } from './types';

// Component prop interfaces
export interface CreateEditTeamModalProps {
  team?: Team | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface CreateEditExpenseModalProps {
  expense?: Expense | null;
  teams: Team[];
  onClose: () => void;
  onSuccess: () => void;
}

export interface EditExpenseModalProps {
  expense: Expense;
  team: Team | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Form interfaces
export interface TeamFormData {
  name: string;
  budget: number;
  members: Array<{
    name: string;
    email: string;
  }>;
}

export interface ExpenseFormData {
  team: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

// Filter and search interfaces
export interface ExpenseFilters {
  status?: 'pending' | 'approved' | 'rejected';
  category?: string;
  team?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  amountMin?: number;
  amountMax?: number;
}

export interface TeamFilters {
  budgetMin?: number;
  budgetMax?: number;
  memberCount?: number;
}

// Chart and visualization interfaces
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface PieChartData {
  labels: string[];
  data: number[];
  backgroundColor: string[];
}

// Notification and alert interfaces
export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface BudgetAlert {
  teamId: string;
  teamName: string;
  alertType: 'eighty_percent' | 'hundred_percent' | 'over_budget';
  currentSpending: number;
  budget: number;
  utilizationPercentage: number;
}

// Table and list interfaces
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Modal and dialog interfaces
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

// Loading and state interfaces
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}

// Utility interfaces
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  sort?: SortConfig;
  pagination?: PaginationConfig;
}
