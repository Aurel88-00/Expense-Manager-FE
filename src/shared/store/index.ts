import { configureStore } from '@reduxjs/toolkit';
import teamReducer from '../../domains/team/store/teamSlice';
import expenseReducer from '../../domains/expense/store/expenseSlice';

export const store = configureStore({
  reducer: {
    teams: teamReducer,
    expenses: expenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
