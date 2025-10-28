import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import type { Expense } from '../../../shared/lib/types';
import type { CreateEditExpenseModalProps } from '../../../shared/lib/interfaces';
import type { TTeam } from '../interfaces';
import { isValidMongoId, extractMongoId } from '../../../shared/utils';
import { useCreateExpense, useUpdateExpense } from '../hooks/useExpenses';
import { Modal, ModalFooter, TextInput, Select, Textarea } from '../../../shared/components/ui';
import { EXPENSE_CATEGORIES } from '../../../shared/lib/constants';

type Props = (CreateEditExpenseModalProps & { teams: TTeam[] });

const CreateEditExpenseModal = ({ expense, teams, onClose, onSuccess }: Props) => {
  const { mutate: createExpense, isPending: isCreating } = useCreateExpense();
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense();

  const [formData, setFormData] = useState({
    description: expense?.description || '',
    amount: expense?.amount || 0,
    category: expense?.category || '',
    date: expense?.date ? format(new Date(expense.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    team: extractMongoId(expense?.team) || '',
  });

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (expense) {
      const updateData = {
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
        date: formData.date,
      };
      
      updateExpense(
        { id: expense._id, data: updateData },
        { onSuccess }
      );
    } else {
      const teamId = extractMongoId(formData.team);
      if (!isValidMongoId(teamId)) {
        toast.error('Please select a valid team');
        return;
      }
      
      const createData = {
        team: teamId,
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
        date: formData.date,
        submittedBy: {
          name: 'System User',
          email: 'aurelmirashidmc@gmail.com'
        }
      } as Partial<Expense>;
      
      createExpense(createData, { onSuccess });
    }
  }, [expense, formData, createExpense, updateExpense, onSuccess]);

  const isPending = isCreating || isUpdating;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={expense ? 'Edit Expense' : 'Create New Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          id="description"
          label="Description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            id="amount"
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            required
          />

          <TextInput
            id="date"
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <Select
          id="category"
          label="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={[
            { value: '', label: '-- Select a category --' },
            ...EXPENSE_CATEGORIES.map(c => ({ value: c, label: c }))
          ]}
          required
        />

        <Select
          id="team"
          label="Team"
          value={formData.team}
          onChange={(e) => setFormData({ ...formData, team: e.target.value })}
          options={[
            { value: '', label: '-- Select a team --' },
            ...teams.map(t => ({ value: extractMongoId(t._id), label: t.name }))
          ]}
          required
          disabled={!!expense}
        />

        <ModalFooter
          onClose={onClose}
          onSubmit={() => {}}
          submitLabel={expense ? 'Update Expense' : 'Create Expense'}
          isLoading={isPending}
        />
      </form>
    </Modal>
  );
};

export default CreateEditExpenseModal;


