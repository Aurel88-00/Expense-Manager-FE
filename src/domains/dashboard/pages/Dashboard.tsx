import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Receipt, DollarSign, Plus } from 'lucide-react';
import { useTeams } from '../../team/hooks/useTeams';
import type { DashboardStats } from '../../../shared/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { prepareBudgetChartData, prepareUtilizationChartData, calculateDashboardStatistics } from '../../../shared/utils';
import { PageErrorBoundary, ComponentErrorBoundary } from '../../../shared/components';
import { Button, StatCard, LoadingState, ErrorState } from '../../../shared/components/ui';

const ExpenseManagementDashboard = () => {
  const { data: teams = [], isLoading, error } = useTeams();

  const budgetStatuses = useMemo(() => {
    const statuses = teams.map(team => {
      return {
        teamId: team._id,
        teamName: team.name,
        budget: team.budget,
        currentSpending: team.currentSpending ?? 0,
        remainingBudget: (team.budget ?? 0) - (team.currentSpending ?? 0),
        utilizationPercentage: team.budget ? ((team.currentSpending ?? 0) / team.budget) * 100 : 0,
        isOverBudget: (team.currentSpending ?? 0) > (team.budget ?? 0),
        isNearBudget: (team.currentSpending ?? 0) > (team.budget ?? 0) * 0.8 && (team.currentSpending ?? 0) <= (team.budget ?? 0),
        alertStatus: team.budgetAlerts ?? {
          eightyPercentSent: false,
          hundredPercentSent: false
        }
      };
    });
    return statuses;
  }, [teams]);

  const dashboardStatistics: DashboardStats = useMemo(() => 
    calculateDashboardStatistics(teams, budgetStatuses),
    [teams, budgetStatuses]
  );

  const budgetChartData = prepareBudgetChartData(budgetStatuses);
  const utilizationChartData = prepareUtilizationChartData(budgetStatuses);

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading dashboard"
        description="Please try refreshing the page"
      />
    );
  }

  return (
    <PageErrorBoundary pageName="Dashboard">
      <div className="w-full bg-background p-4 sm:p-6">
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your expense management system</p>
            </div>
            <Link to="/teams">
              <Button icon={Plus}>Add Team</Button>
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Users className="h-6 w-6 text-gray-400" />}
              label="Total Teams"
              value={dashboardStatistics.totalTeams}
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6 text-gray-400" />}
              label="Total Budget"
              value={`$${dashboardStatistics.totalBudget?.toLocaleString() || '0'}`}
            />
            <StatCard
              icon={<Receipt className="h-6 w-6 text-gray-400" />}
              label="Total Spent"
              value={`$${dashboardStatistics.totalSpent?.toLocaleString() || '0'}`}
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6 text-gray-400" />}
              label="Total Remaining"
              value={`$${((dashboardStatistics.totalBudget || 0) - (dashboardStatistics.totalSpent || 0)).toLocaleString()}`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Chart */}
            {budgetChartData.length > 0 && (
              <ComponentErrorBoundary componentName="Budget Chart">
                <div className="bg-card shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4">Team Budgets</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetChartData as object[]} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-400" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#6b7280" className="dark:stroke-gray-400" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                          border: '1px solid #374151', 
                          borderRadius: '8px', 
                          color: '#ffffff',
                          padding: '8px 12px'
                        }}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                      />
                      <Bar dataKey="budget" fill="#3b82f6" name="Budget" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="spent" fill="#ef4444" name="Spent" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ComponentErrorBoundary>
            )}

            {/* Utilization Chart */}
            {utilizationChartData.length > 0 && (
              <ComponentErrorBoundary componentName="Utilization Chart">
                <div className="bg-card shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-foreground mb-4">Budget Utilization</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={utilizationChartData as object[]} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-400" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#6b7280" className="dark:stroke-gray-400" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                          border: '1px solid #374151', 
                          borderRadius: '8px', 
                          color: '#ffffff',
                          padding: '8px 12px'
                        }}
                        formatter={(value) => {
                          if (typeof value === 'number') {
                            return [`${value.toFixed(1)}%`, ''];
                          }
                          return [String(value), ''];
                        }}
                      />
                      <Bar dataKey="utilization" fill="#8b5cf6" name="Utilization %" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ComponentErrorBoundary>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-card shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
            <div className="flex gap-3 flex-wrap">
              <Link to="/teams">
                <Button variant="secondary">View All Teams</Button>
              </Link>
              <Link to="/expenses">
                <Button variant="secondary">View All Expenses</Button>
              </Link>
              <Link to="/teams">
                <Button icon={Plus}>Create New Team</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default ExpenseManagementDashboard;