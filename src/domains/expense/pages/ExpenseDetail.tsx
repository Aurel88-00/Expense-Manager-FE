import { useState, useCallback, useDeferredValue } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Receipt, 
  CheckCircle, 
  XCircle, 
  Clock,
  Bot,
  AlertTriangle,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { useExpenseById, useUpdateExpense, useDeleteExpense } from '../hooks/useExpenses';
import { useTeamById } from '../../team/hooks/useTeams';
import type { EditExpenseModalProps } from '../../../shared/lib/interfaces';
import { format } from 'date-fns';
import { PageErrorBoundary } from '../../../shared/components';

const ExpenseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isShowEditModal, setIsShowEditModal] = useState<boolean>(false);

  const { data: expense, isLoading, error } = useExpenseById(id || '');
  const { data: team } = useTeamById(
    typeof expense?.team === 'string' ? expense.team : expense?.team?._id || ''
  );
  const { mutate: updateExpense } = useUpdateExpense();
  const { mutate: deleteExpense } = useDeleteExpense();

  const deferredTeam = useDeferredValue(team);

  const handleStatusChange = useCallback((newStatus: 'approved' | 'rejected'): void => {
    if (!expense) return;

    updateExpense({
      id: expense._id,
      data: {
        status: newStatus,
        approvedBy: {
          name: 'System Admin',
          email: 'admin@expensemanagement.com',
          approvedAt: new Date().toISOString()
        }
      }
    });
  }, [expense, updateExpense]);

  const handleDelete = useCallback((): void => {
    if (!expense) return;

    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    deleteExpense(expense._id, {
      onSuccess: () => {
        window.location.href = '/expenses';
      }
    });
  }, [expense, deleteExpense]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="text-center py-12">
        <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">Expense not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">The expense you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link
            to="/expenses"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageErrorBoundary pageName="Expense Detail">
      <div className="w-full bg-background p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/expenses" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Expense Details</h1>
                <p className="text-muted-foreground">View and manage expense information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsShowEditModal(true)}
                className="inline-flex items-center px-3 py-2 border border-border shadow-sm text-sm leading-4 font-medium rounded-md text-secondary-foreground bg-secondary hover:bg-secondary/80"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-destructive-foreground bg-destructive hover:bg-destructive/90"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Status Alerts */}
          {expense.isDuplicate && (
            <div className="bg-warning/10 border border-warning/20 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-warning">Potential Duplicate</h3>
                  <div className="mt-2 text-sm text-warning/80">
                    <p>{expense.duplicateReason}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {expense.aiSuggestedCategory && expense.aiSuggestedCategory !== expense.category && (
            <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
              <div className="flex">
                <Bot className="h-5 w-5 text-primary shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary">AI Category Suggestion</h3>
                  <div className="mt-2 text-sm text-primary/80">
                    <p>AI suggested category: <strong>{expense.aiSuggestedCategory}</strong></p>
                    <p>Current category: <strong>{expense.category}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                    <dd className="mt-1 text-sm text-foreground">{expense.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                    <dd className="mt-1 text-sm text-foreground">${expense.amount.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                    <dd className="mt-1 text-sm text-foreground">{expense.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                    <dd className="mt-1 text-sm text-foreground">{format(new Date(expense.date), 'PPP')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Team</dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {deferredTeam ? (
                        <Link to={`/teams/${deferredTeam._id}`} className="text-primary hover:text-primary/80">
                          {deferredTeam.name}
                        </Link>
                      ) : (
                        'Unknown Team'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                    <dd className="mt-1 text-sm text-foreground">{format(new Date(expense.createdAt), 'PPP')}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-card shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Submitter Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                    <dd className="mt-1 text-sm text-foreground">{expense.submittedBy.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd className="mt-1 text-sm text-foreground">{expense.submittedBy.email}</dd>
                  </div>
                </dl>
              </div>

              {expense.approvedBy && (
                <div className="bg-card shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-foreground mb-4">Approval Information</h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Approved By</dt>
                      <dd className="mt-1 text-sm text-foreground">{expense.approvedBy.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Approver Email</dt>
                      <dd className="mt-1 text-sm text-foreground">{expense.approvedBy.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Approved At</dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {format(new Date(expense.approvedBy.approvedAt), 'PPP')}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Status</h3>
                <div className="flex items-center space-x-3 mb-4">
                  {getStatusIcon(expense.status)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </div>
                
                {expense.status === 'pending' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-success-foreground bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange('rejected')}
                      className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-destructive-foreground bg-destructive hover:bg-destructive/90"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-card shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    to={`/expenses?team=${typeof expense.team === 'string' ? expense.team : expense.team._id}`}
                    className="w-full inline-flex justify-center items-center px-3 py-2 border border-border shadow-sm text-sm leading-4 font-medium rounded-md text-secondary-foreground bg-secondary hover:bg-secondary/80"
                  >
                    View Team Expenses
                  </Link>
                  {deferredTeam && (
                    <Link
                      to={`/teams/${deferredTeam._id}`}
                      className="w-full inline-flex justify-center items-center px-3 py-2 border border-border shadow-sm text-sm leading-4 font-medium rounded-md text-secondary-foreground bg-secondary hover:bg-secondary/80"
                    >
                      View Team Details
                    </Link>
                  )}
                </div>
              </div>

              <div className="bg-card shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Metadata</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Expense ID</dt>
                    <dd className="mt-1 text-sm text-foreground font-mono">{expense._id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                    <dd className="mt-1 text-sm text-foreground">{format(new Date(expense.createdAt), 'PPpp')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                    <dd className="mt-1 text-sm text-foreground">{format(new Date(expense.updatedAt), 'PPpp')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {isShowEditModal && (
            <EditExpenseModal
              expense={expense}
              team={deferredTeam || null}
              onClose={() => setIsShowEditModal(false)}
              onSuccess={() => {
                setIsShowEditModal(false);
              }}
            />
          )}
        </div>
      </div>
    </PageErrorBoundary>
  );
};

const EditExpenseModal = ({ expense, onClose, onSuccess }: EditExpenseModalProps) => {
  const { mutate: updateExpenseData, isPending } = useUpdateExpense();
  
  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || 0,
    category: expense?.category || '',
    date: expense?.date ? format(new Date(expense.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    status: expense?.status || 'pending'
  });

  const categories = [
    'Travel', 'Meals', 'Office Supplies', 'Software', 
    'Marketing', 'Training', 'Equipment', 'Utilities', 'Other'
  ];

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    updateExpenseData(
      { id: expense?._id || '', data: formData },
      { onSuccess }
    );
  }, [expense?._id, formData, updateExpenseData, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Expense</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'approved' | 'rejected' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isPending ? 'Updating...' : 'Update Expense'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
