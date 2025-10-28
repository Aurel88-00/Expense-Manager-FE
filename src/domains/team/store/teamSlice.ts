import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Team, BudgetStatus } from '../../../shared/lib/types';
import type { ITeamState } from './interfaces';
import { teamApi } from '../services/teamApi';

const initialState: ITeamState = {
  teams: [],
  selectedTeam: null,
  budgetStatuses: [],
  loading: false,
  error: null,
};


export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await teamApi.getAll();
      return response.data.teams;
    } catch (error) {
      console.error('Error fetching teams:', error);
      return rejectWithValue('Failed to fetch teams');
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  'teams/fetchTeamById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await teamApi.getById(id);
      return response.data.team;
    } catch (error) {
      console.error('Error fetching team by ID:', error);
      return rejectWithValue('Failed to fetch team');
    }
  }
);

export const fetchBudgetStatuses = createAsyncThunk(
  'teams/fetchBudgetStatuses',
  async (teamIds: string[], { rejectWithValue }) => {
    try {
      const budgetStatusPromises = teamIds.map(id =>
        teamApi.getBudgetStatus(id).catch(() => null)
      );
      const responses = await Promise.all(budgetStatusPromises);
      return responses
        .filter(response => response?.data?.success)
        .map(response => response?.data?.budgetStatus)
        .filter((status): status is BudgetStatus => status !== undefined);
    } catch (error) {
      console.error('Error fetching budget statuses:', error);
      return rejectWithValue('Failed to fetch budget statuses');
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (data: Partial<Team>, { rejectWithValue }) => {
    try {
      const response = await teamApi.create(data);
      return response.data.team;
    } catch (error) {
      console.error('Error creating team:', error);
      return rejectWithValue('Failed to create team');
    }
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ id, data }: { id: string; data: Partial<Team> }, { rejectWithValue }) => {
    try {
      const response = await teamApi.update(id, data);
      return response.data.team;
    } catch (error) {
      console.error('Error updating team:', error);
      return rejectWithValue('Failed to update team');
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (id: string, { rejectWithValue }) => {
    try {
      await teamApi.delete(id);
      return id;
    } catch (error) {
      console.error('Error deleting team:', error);
      return rejectWithValue('Failed to delete team');
    }
  }
);

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch teams
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch team by ID
    builder
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeam = action.payload;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch budget statuses
    builder
      .addCase(fetchBudgetStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgetStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.budgetStatuses = action.payload;
      })
      .addCase(fetchBudgetStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create team
    builder
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.push(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update team
    builder
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teams.findIndex(team => team._id === action.payload._id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.selectedTeam?._id === action.payload._id) {
          state.selectedTeam = action.payload;
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete team
    builder
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = state.teams.filter(team => team._id !== action.payload);
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedTeam } = teamSlice.actions;
export default teamSlice.reducer;
