import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Expense, BulkActionData } from '../../../shared/lib/types';
import type { IExpenseState } from './interfaces';
import { expenseApi } from '../services/expenseApi';

const initialState: IExpenseState = {
  expenses: [],
  selectedExpense: null,
  insights: null,
  forecast: null,
  loading: false,
  error: null,
};


export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params: Record<string, string | number> = {}, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getAll(params);
      return response.data.expenses;
    } catch (error) {
      return rejectWithValue('Failed to fetch expenses');
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  'expenses/fetchExpenseById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getById(id);
      return response.data.expense;
    } catch (error) {
      return rejectWithValue('Failed to fetch expense');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (data: Partial<Expense>, { rejectWithValue }) => {
    try {
      const response = await expenseApi.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, data }: { id: string; data: Partial<Expense> }, { rejectWithValue }) => {
    try {
      const response = await expenseApi.update(id, data);
      return response.data.expense;
    } catch (error) {
      return rejectWithValue('Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: string, { rejectWithValue }) => {
    try {
      await expenseApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete expense');
    }
  }
);

export const fetchInsights = createAsyncThunk(
  'expenses/fetchInsights',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getInsights(teamId);
      return response.data.insights;
    } catch (error) {
      return rejectWithValue('Failed to fetch insights');
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'expenses/fetchForecast',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await expenseApi.getForecast(teamId);
      return response.data.forecast;
    } catch (error) {
      return rejectWithValue('Failed to fetch forecast');
    }
  }
);

export const bulkAction = createAsyncThunk(
  'expenses/bulkAction',
  async (data: BulkActionData, { rejectWithValue }) => {
    try {
      const response = await expenseApi.bulkAction(data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to perform bulk action');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedExpense: (state) => {
      state.selectedExpense = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch expenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch expense by ID
    builder
      .addCase(fetchExpenseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpense = action.payload;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create expense
    builder
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload.expense);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update expense
    builder
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex(exp => exp._id === action.payload._id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        if (state.selectedExpense?._id === action.payload._id) {
          state.selectedExpense = action.payload;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete expense
    builder
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter(exp => exp._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch insights
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch forecast
    builder
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Bulk action
    builder
      .addCase(bulkAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkAction.fulfilled, (state, _action) => {
        state.loading = false;
      })
      .addCase(bulkAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
