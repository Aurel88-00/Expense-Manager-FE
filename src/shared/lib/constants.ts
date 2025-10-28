export const EXPENSE_CATEGORIES = [
  'Travel',
  'Meals',
  'Office Supplies',
  'Software',
  'Marketing',
  'Training',
  'Equipment',
  'Utilities',
  'Other'
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const EXPENSE_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export type ExpenseStatus = typeof EXPENSE_STATUSES[keyof typeof EXPENSE_STATUSES];

export const TEAM_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export type TeamRole = typeof TEAM_ROLES[keyof typeof TEAM_ROLES];

export const BUDGET_THRESHOLDS = {
  WARNING: 0.8, // 80%
  CRITICAL: 1.0 // 100%
} as const;

export const API_ENDPOINTS = {
  TEAMS: '/teams',
  EXPENSES: '/expenses',
  INSIGHTS: '/insights',
  FORECAST: '/forecast',
  BUDGET_STATUS: '/budget-status',
  BULK_ACTION: '/bulk-action'
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_PREFERENCES: 'userPreferences',
  FILTERS: 'filters'
} as const;

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  GRAY: '#6b7280'
} as const;

export const STATUS_COLORS = {
  [EXPENSE_STATUSES.PENDING]: CHART_COLORS.WARNING,
  [EXPENSE_STATUSES.APPROVED]: CHART_COLORS.SUCCESS,
  [EXPENSE_STATUSES.REJECTED]: CHART_COLORS.DANGER
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd'
} as const;

export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  LOCALE: 'en-US'
} as const;

export const VALIDATION_RULES = {
  TEAM_NAME_MIN_LENGTH: 2,
  TEAM_NAME_MAX_LENGTH: 50,
  EXPENSE_DESCRIPTION_MIN_LENGTH: 5,
  EXPENSE_DESCRIPTION_MAX_LENGTH: 200,
  EXPENSE_AMOUNT_MIN: 0.01,
  EXPENSE_AMOUNT_MAX: 999999.99,
  BUDGET_MIN: 0,
  BUDGET_MAX: 9999999.99
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const;

export const TOAST_DURATIONS = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 4000
} as const;
