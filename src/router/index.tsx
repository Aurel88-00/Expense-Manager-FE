import { lazy, Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Layout } from '../shared/components';
import { LoadingState } from '../shared/components/ui';

const ExpenseManagementDashboard = lazy(() => import('../domains/dashboard/pages/Dashboard'));
const TeamManagementPage = lazy(() => import('../domains/team/pages/Teams'));
const Expenses = lazy(() => import('../domains/expense/pages/Expenses'));
const TeamDetail = lazy(() => import('../domains/team/pages/TeamDetail'));
const ExpenseDetail = lazy(() => import('../domains/expense/pages/ExpenseDetail'));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<LoadingState message="Loading page..." />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: withSuspense(ExpenseManagementDashboard),
      },
      {
        path: "teams",
        element: withSuspense(TeamManagementPage),
      },
      {
        path: "teams/:id",
        element: withSuspense(TeamDetail),
      },
      {
        path: "expenses",
        element: withSuspense(Expenses),
      },
      {
        path: "expenses/:id",
        element: withSuspense(ExpenseDetail),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
