import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, DollarSign, Receipt, TrendingUp, AlertTriangle, Bot, Plus, Eye } from 'lucide-react';
import { useTeamById, useBudgetStatus } from '../hooks/useTeams';
import { useSpendingInsights, useBudgetForecast } from '../../expense/hooks/useExpenses';
import type { Expense, TActiveTab } from '../../../shared/lib/types';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PageErrorBoundary, ComponentErrorBoundary } from '../../../shared/components';
import { Button, Card, CardBody, StatCard, LoadingState, EmptyState, StatusBadge } from '../../../shared/components/ui';
import React from 'react';

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TActiveTab>('overview');

  const { data: team, isLoading, error } = useTeamById(id || '');
  const { data: budgetStatus } = useBudgetStatus(id || '');
  const { data: insights } = useSpendingInsights(id || '');
  const { data: forecast } = useBudgetForecast(id || '');
  
  const [expenses, setExpenses] = useState<Expense[]>([]);

  React.useEffect(() => {
    if (id) {
      const fetchExpenses = async () => {
        try {
          const response = await (await import('../services/teamApi')).teamApi.getExpenses(id, { limit: 10 });
          setExpenses(response?.data?.expenses || []);
        } catch (err) {
          console.error('Failed to fetch expenses:', err);
        }
      };
      fetchExpenses();
    }
  }, [id]);

  const getBudgetStatusColor = () => {
    if (!budgetStatus) return 'text-gray-600';
    if (budgetStatus.isOverBudget) return 'text-red-600';
    if (budgetStatus.isNearBudget) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBudgetStatusText = () => {
    if (!budgetStatus) return 'Unknown';
    if (budgetStatus.isOverBudget) return 'Over Budget';
    if (budgetStatus.isNearBudget) return 'Near Budget';
    return 'On Track';
  };

  const categoryData = insights?.categoryBreakdown ? 
    Object.entries(insights.categoryBreakdown).map(([category, amount]) => ({
      category,
      amount
    })) : [];

  const recentExpenses = expenses.slice(0, 10);

  if (isLoading) {
    return <LoadingState message="Loading team details..." />;
  }

  if (error || !team || !budgetStatus) {
    return (
      <EmptyState
        icon={Users}
        title="Team not found"
        description="The team you're looking for doesn't exist."
      />
    );
  }

  return (
    <PageErrorBoundary pageName="Team Detail">
      <div className="w-full bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{team?.name || 'Unknown Team'}</h1>
              <p className="text-muted-foreground">Team budget and expense management</p>
            </div>
            <Link to={`/expenses?team=${team?._id || ''}`}>
              <Button icon={Plus}>Add Expense</Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
              label="Total Budget"
              value={`$${budgetStatus.budget.toLocaleString()}`}
            />
            <StatCard
              icon={<Receipt className="h-6 w-6 text-muted-foreground" />}
              label="Total Spent"
              value={`$${budgetStatus.currentSpending.toLocaleString()}`}
            />
            <StatCard
              icon={<TrendingUp className="h-6 w-6 text-muted-foreground" />}
              label="Remaining"
              value={`$${budgetStatus.remainingBudget.toLocaleString()}`}
            />
            <StatCard
              icon={<AlertTriangle className={`h-6 w-6 ${getBudgetStatusColor()}`} />}
              label="Status"
              value={getBudgetStatusText()}
            />
          </div>

          {/* Budget Utilization */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-medium text-foreground mb-4">Budget Utilization</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{budgetStatus.utilizationPercentage.toFixed(1)}%</span>
                </div>
                  <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      budgetStatus.utilizationPercentage >= 100
                        ? 'bg-destructive'
                        : budgetStatus.utilizationPercentage >= 80
                        ? 'bg-warning'
                        : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(budgetStatus.utilizationPercentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${budgetStatus.currentSpending.toLocaleString()} spent</span>
                  <span>${budgetStatus.budget.toLocaleString()} budget</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Tabs Navigation */}
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
              {[
                { id: 'overview', name: 'Overview', icon: Users },
                { id: 'expenses', name: 'Recent Expenses', icon: Receipt },
                { id: 'insights', name: 'AI Insights', icon: Bot }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TActiveTab)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardBody>
                  <h3 className="text-lg font-medium text-foreground mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {team?.members?.map((member, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2 ${
                          member.role === 'admin' 
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {forecast && (
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-medium text-foreground mb-4">Budget Forecast</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Will exceed budget?</span>
                        <span className={`text-sm font-medium ${
                          forecast.willExceedBudget ? 'text-destructive' : 'text-success'
                        }`}>
                          {forecast.willExceedBudget ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <span className="text-sm font-medium text-foreground">{(forecast.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Monthly Spending</span>
                        <span className="text-sm font-medium text-foreground">${forecast.averageMonthlySpending.toLocaleString()}</span>
                      </div>
                      {forecast.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Recommendations:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {forecast.recommendations.map((rec, index) => (
                              <li key={index}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'expenses' && (
            <Card>
              <CardBody className="p-0">
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-medium text-foreground">Recent Expenses</h3>
                </div>
                <div className="divide-y divide-border">
                  {recentExpenses.map((expense) => (
                    <div key={expense._id} className="px-4 sm:px-6 py-4 hover:bg-accent">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-foreground truncate">
                              {expense.description}
                            </p>
                            {expense.isDuplicate && (
                              <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>${expense.amount.toLocaleString()}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{expense.category}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={expense.status as any} />
                          <Link to={`/expenses/${expense._id}`}>
                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {recentExpenses.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No recent expenses</p>
                  </div>
                )}
                <div className="px-4 sm:px-6 py-3 bg-muted text-center border-t border-border">
                  <Link
                    to={`/expenses?team=${team?._id || ''}`}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    View all expenses →
                  </Link>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'insights' && insights && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardBody>
                  <h3 className="text-lg font-medium text-foreground mb-4">Spending Insights</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Summary</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insights.summary}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Top Category</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insights.topCategory}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Trends</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insights.trends}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Budget Health</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insights.budgetHealth}</p>
                    </div>
                    {insights.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground">Recommendations</h4>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          {insights.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {categoryData.length > 0 && (
                <ComponentErrorBoundary componentName="Category Breakdown Chart">
                  <Card>
                    <CardBody>
                      <h3 className="text-lg font-medium text-foreground mb-4">Spending by Category</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: any) => `${props.category} ${(props.percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="amount"
                          >
                            {categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '8px 12px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardBody>
                  </Card>
                </ComponentErrorBoundary>
              )}
            </div>
          )}
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default TeamDetail;
