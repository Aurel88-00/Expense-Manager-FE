import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Receipt, CheckCircle, XCircle, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useExpenses, useDeleteExpense, useBulkAction } from '../hooks/useExpenses';
import { useTeams } from '../../team/hooks/useTeams';
import type { Expense } from '../../../shared/lib/types';
import toast from 'react-hot-toast';
import { PageErrorBoundary } from '../../../shared/components';
import { Button, Card, CardBody, LoadingState, EmptyState, ErrorState, TextInput, Select, StatusBadge } from '../../../shared/components/ui';
import CreateEditExpenseModal from '../components/CreateEditExpenseModal';
import { EXPENSE_CATEGORIES, EXPENSE_STATUSES } from '../../../shared/lib/constants';

const Expenses = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>('');
  
  const [filters, setFilters] = useState({
    team: searchParams.get('team') || '',
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    search: searchParams.get('search') || ''
  });

  
  useEffect(() => {
    const newFilters = {
      team: searchParams.get('team') || '',
      status: searchParams.get('status') || '',
      category: searchParams.get('category') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      search: searchParams.get('search') || ''
    };
    setFilters(newFilters);
  }, [searchParams]);

  const statuses = [EXPENSE_STATUSES.PENDING, EXPENSE_STATUSES.APPROVED, EXPENSE_STATUSES.REJECTED] as const;

  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  
  
  const filterParams = useMemo(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    console.log('Filter params:', params); 
    return params;
  }, [filters]);
  
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useExpenses(filterParams);
  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: bulkActionMutate } = useBulkAction();

  const availableCategories = useMemo(() => [...EXPENSE_CATEGORIES], []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      team: '',
      status: '',
      category: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setSearchParams({});
  };

  // PDF export removed for memory optimization

  const handleDeleteExpense = useCallback((expenseId: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    deleteExpense(expenseId);
  }, [deleteExpense]);

  const handleBulkAction = useCallback((action: 'approve' | 'reject') => {
    if (selectedExpenses.length === 0) {
      toast.error('Please select expenses to perform bulk action');
      return;
    }
    bulkActionMutate(
      {
        expenseIds: selectedExpenses,
        action,
        approvedBy: {
          name: 'System Admin',
          email: 'aurelmirashidmc@gmail.com'
        }
      },
      {
        onSuccess: () => {
          setSelectedExpenses([]);
        }
      }
    );
  }, [selectedExpenses, bulkActionMutate]);

  const toggleExpenseSelection = (expenseId: string) => {
    setSelectedExpenses(prev => 
      prev.includes(expenseId) 
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const selectAllExpenses = () => {
    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(expenses.map(expense => expense?._id || ''));
    }
  };

  const isLoading = teamsLoading || expensesLoading;

  if (isLoading) {
    return <LoadingState message="Loading expenses..." />;
  }

  if (expensesError) {
    return <ErrorState title="Error loading expenses" description="Please try refreshing the page" />;
  }

  return (
    <PageErrorBoundary pageName="Expenses">
      <div className="w-full bg-background p-4 sm:p-6">
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
              <p className="text-muted-foreground">Manage and track team expenses</p>
            </div>
                   <div className="flex gap-2">
                     <Button icon={Plus} onClick={() => setShowCreateModal(true)}>Add Expense</Button>
                   </div>
          </div>

          {/* Filters Card */}
          <Card>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <Select
                  id="team-filter"
                  label="Team"
                  value={filters.team}
                  onChange={(e) => handleFilterChange('team', e.target.value)}
                  options={[{ value: '', label: 'All Teams' }, ...teams.map(t => ({ value: t._id, label: t.name }))]}
                />

                <Select
                  id="status-filter"
                  label="Status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  options={[{ value: '', label: 'All Statuses' }, ...statuses.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))]}
                />

                <Select
                  id="category-filter"
                  label="Category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  options={[{ value: '', label: 'All Categories' }, ...availableCategories.map(c => ({ value: c, label: c }))]}
                />

                <TextInput
                  id="start-date-filter"
                  label="Start Date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />

                <TextInput
                  id="end-date-filter"
                  label="End Date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />

                <div className="flex items-end">
                  <TextInput
                    id="search-filter"
                    label="Search"
                    placeholder="Search expenses..."
                    value={search}
                    onChange={(e) => {
                      if(e.target && e.target.value.length > 0) {
                        setSearch((e.target as HTMLInputElement).value);
                      } else {
                        setSearch('');
                        handleFilterChange('search', '');
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                       e.preventDefault();
                       handleFilterChange('search', search);
                      }
                    }}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <span className="text-sm text-muted-foreground">
                  {expenses.length} expenses found
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Bulk Actions */}
          {selectedExpenses.length > 0 && (
            <Card className="bg-primary/10 border border-primary/20">
              <CardBody>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-sm text-primary font-medium">
                    {selectedExpenses.length} expenses selected
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="success" size="sm" onClick={() => handleBulkAction('approve')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Selected
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleBulkAction('reject')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Selected
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Expenses List */}
          {expenses.length > 0 ? (
            <Card>
              <CardBody className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted">
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                            onChange={selectAllExpenses}
                            className="rounded border-input bg-background"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell">Team</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense) => (
                        <tr key={expense._id} className="border-b border-border hover:bg-accent">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedExpenses.includes(expense?._id || '')}
                              onChange={() => toggleExpenseSelection(expense?._id || '')}
                              className="rounded border-input bg-background"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{expense.description}</span>
                              {expense.isDuplicate && (
                                <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">${expense.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                            {typeof expense.team === 'string' ? expense.team : expense.team?.name || 'Unknown'}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{expense.category}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={expense.status as 'pending' | 'approved' | 'rejected'} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1 flex-wrap">
                              <Link to={`/expenses/${expense._id}`}>
                                <Button variant="secondary" size="sm" icon={Eye}>View</Button>
                              </Link>
                              <Button variant="secondary" size="sm" icon={Edit} onClick={() => {
                                setEditingExpense(expense);
                                setShowCreateModal(true);
                              }}>Edit</Button>
                              <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDeleteExpense(expense._id)}>Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          ) : (
            <EmptyState
              icon={Receipt}
              title="No expenses found"
              description="Create your first expense or adjust your filters."
              action={<Button onClick={() => setShowCreateModal(true)}>Create Expense</Button>}
            />
          )}

        
          {showCreateModal && (
            <CreateEditExpenseModal
              expense={editingExpense}
              teams={teams}
              onClose={() => {
                setShowCreateModal(false);
                setEditingExpense(null);
              }}
              onSuccess={() => {
                setShowCreateModal(false);
                setEditingExpense(null);
              }}
            />
          )}
        </div>
      </div>
    </PageErrorBoundary>
  );
};


export default Expenses;
