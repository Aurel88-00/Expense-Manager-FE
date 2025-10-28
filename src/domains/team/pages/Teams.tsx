import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, Eye, Edit, Trash2 } from "lucide-react";
import { useTeams, useDeleteTeam } from "../hooks/useTeams";
import type { Team } from "../../../shared/lib/types";
import {
  getTeamBudgetStatusColor,
  getTeamBudgetStatusText,
} from "../../../shared/utils";
import { PageErrorBoundary } from "../../../shared/components";
import {
  Button,
  Card,
  CardBody,
  LoadingState,
  EmptyState,
  ErrorState,
} from "../../../shared/components/ui";
import CreateEditTeamModal from "../components/CreateEditTeamModal";

const TeamManagementPage = () => {
  const { data: teams = [], isLoading, error } = useTeams();
  const { mutate: deleteTeam } = useDeleteTeam();

  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [editingTeamData, setEditingTeamData] = useState<Team | null>(null);

  const handleCreateModalOpen = useCallback(() => {
    setIsCreateModalVisible(true);
  }, []);

  const handleCreateModalClose = useCallback(() => {
    setIsCreateModalVisible(false);
    setEditingTeamData(null);
  }, []);

  const handleEditTeam = useCallback((team: Team) => {
    setEditingTeamData(team);
    setIsCreateModalVisible(true);
  }, []);

  const handleDeleteTeam = useCallback(
    (teamId: string) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this team? This action cannot be undone."
        )
      ) {
        return;
      }
      deleteTeam(teamId);
    },
    [deleteTeam]
  );

  const handleModalSuccess = useCallback(() => {
    handleCreateModalClose();
  }, [handleCreateModalClose]);

  if (isLoading) {
    return <LoadingState message="Loading teams..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading teams"
        description="Please try refreshing the page"
      />
    );
  }

  return (
    <PageErrorBoundary pageName="Teams">
      <div className="w-full bg-background p-4 sm:p-6">
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Teams</h1>
              <p className="text-muted-foreground">
                Manage your teams and their budgets
              </p>
            </div>
            <Button icon={Plus} onClick={handleCreateModalOpen}>
              Add Team
            </Button>
          </div>

          {/* Teams Grid */}
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <Card key={team?._id}>
                  <CardBody>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center min-w-0 flex-1">
                        <Users className="h-8 w-8 text-primary shrink-0" />
                        <h3 className="ml-3 text-lg font-medium text-foreground truncate">
                          {team?.name || "Unknown Team"}
                        </h3>
                      </div>
                      <div className="flex space-x-2 shrink-0">
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="text-muted-foreground hover:text-foreground transition"
                          title="Edit team"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team?._id || "")}
                          className="text-muted-foreground hover:text-destructive transition"
                          title="Delete team"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium text-foreground">
                          ${team?.budget?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Spent:</span>
                        <span className="font-medium text-foreground">
                          ${team?.currentSpending?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span
                          className={`font-medium ${getTeamBudgetStatusColor(
                            team
                          )}`}
                        >
                          {getTeamBudgetStatusText(team)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Members:</span>
                        <span className="font-medium text-foreground">
                          {team?.members?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <Link to={`/teams/${team?._id || ""}`} className="w-full">
                        <Button
                          variant="secondary"
                          fullWidth
                          icon={Eye}
                          iconPosition="left"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No teams"
              description="Get started by creating a new team."
              action={
                <Button onClick={handleCreateModalOpen}>Create Team</Button>
              }
            />
          )}
          
          {isCreateModalVisible && (
            <CreateEditTeamModal
              team={editingTeamData}
              onClose={handleCreateModalClose}
              onSuccess={handleModalSuccess}
            />
          )}
        </div>
      </div>
    </PageErrorBoundary>
  );
};


export default TeamManagementPage;
