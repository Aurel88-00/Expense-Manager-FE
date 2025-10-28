import { useState, useCallback } from 'react';
import type { CreateEditTeamModalProps } from '../../../shared/lib/interfaces';
import type { TSanitizedMember } from '../types';
import { useCreateTeam, useUpdateTeam } from '../hooks/useTeams';
import { Modal, ModalFooter, TextInput, Select, Button } from '../../../shared/components/ui';
import { Trash2 } from 'lucide-react';

const CreateEditTeamModal = ({
  team,
  onClose,
  onSuccess,
}: CreateEditTeamModalProps) => {
  const { mutate: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam();

  const [formData, setFormData] = useState({
    name: team?.name || "",
    budget: team?.budget || 0,
    members: team?.members || [
      { name: "", email: "", role: "member" as const },
    ],
  });

  const sanitizeMembers = (members: any[]): TSanitizedMember[] => {
    return members.map((member) => ({
      name: member.name,
      email: member.email,
      role: member.role,
    }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();

      if (team) {
        const sanitizedMembers = sanitizeMembers(formData.members);
        const payload = {
          ...formData,
          members: sanitizedMembers,
        };
        updateTeam({ id: team._id, data: payload }, { onSuccess });
      } else {
        createTeam(formData, { onSuccess });
      }
    },
    [team, formData, createTeam, updateTeam, onSuccess]
  );

  const addMember = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        { name: "", email: "", role: "member" as const },
      ],
    }));
  }, []);

  const removeMember = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  }, []);

  const updateMember = useCallback(
    (index: number, field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        members: prev.members.map((member, i) =>
          i === index ? { ...member, [field]: value } : member
        ),
      }));
    },
    []
  );

  const isLoading = isCreating || isUpdating;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={team ? "Edit Team" : "Create New Team"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          id="name"
          label="Team Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />

        <TextInput
          id="budget"
          label="Budget"
          type="number"
          value={formData.budget}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, budget: Number(e.target.value) }))
          }
          required
          min="0"
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Members
          </label>
          <div className="space-y-2">
            {formData.members.map((member, index) => (
              <div key={index} className="flex gap-2">
                <TextInput
                  id={`member-name-${index}`}
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  required
                  className="flex-1"
                />
                <TextInput
                  id={`member-email-${index}`}
                  placeholder="Email"
                  type="email"
                  value={member.email}
                  onChange={(e) => updateMember(index, "email", e.target.value)}
                  required
                  className="flex-1"
                />
                <Select
                  id={`member-role-${index}`}
                  value={member.role}
                  onChange={(e) => updateMember(index, "role", e.target.value)}
                  options={[
                    { value: "member", label: "Member" },
                    { value: "admin", label: "Admin" },
                  ]}
                />
                {formData.members.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeMember(index)}
                    icon={Trash2}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addMember}
            >
              + Add Member
            </Button>
          </div>
        </div>

        <ModalFooter
          onClose={onClose}
          onSubmit={() => {
            // const event = new Event('submit', { bubbles: true });
            // document.querySelector('form')?.dispatchEvent(event);
          }}
          submitLabel={team ? "Update Team" : "Create Team"}
          isLoading={isLoading}
        />
      </form>
    </Modal>
  );
};

export default CreateEditTeamModal;
