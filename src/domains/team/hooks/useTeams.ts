import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../services/teamApi';
import type { Team } from '../../../shared/lib/types';
import toast from 'react-hot-toast';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamApi.getAll();
      const teams = response.data.teams ?? [];
      teams.forEach(team => {
        console.log(`Team ${team.name}: currentSpending=${team.currentSpending}, budget=${team.budget}`);
      });
      return teams;
    },
    staleTime: 0,
    gcTime: 10 * 60 * 1000, 
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useTeamById = (teamId: string) => {
  return useQuery({
    queryKey: ['teams', teamId],
    queryFn: async () => {
      const response = await teamApi.getById(teamId);
      if (!response.data.team) {
        throw new Error('Team not found');
      }
      return response.data.team;
    },
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    enabled: !!teamId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useBudgetStatus = (teamId: string) => {
  return useQuery({
    queryKey: ['budgetStatus', teamId],
    queryFn: async () => {
      const response = await teamApi.getBudgetStatus(teamId);
      if (!response.data.budgetStatus) {
        throw new Error('Budget status not found');
      }
      return response.data.budgetStatus;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    enabled: !!teamId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Team>) => {
      const response = await teamApi.create(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Team[]>(['teams'], (old) => {
        if (!old) return [data.team];
        return [data.team, ...old]; 
      });
      
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['budgetStatus'] });
      
      toast.success('Team created successfully!');
    },
    onError: () => {
      toast.error('Failed to create team');
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Team> }) => {
      const response = await teamApi.update(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Team[]>(['teams'], (old) => {
        if (!old) return [data.team];
        return old.map(team => 
          team._id === data.team._id ? data.team : team
        );
      });
      
      queryClient.setQueryData(['teams', data.team._id], data.team);
      
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['budgetStatus'] });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      queryClient.invalidateQueries({ queryKey: ['forecast'] });
      
      toast.success('Team updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update team');
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await teamApi.delete(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['teams'] });
      
      const previousTeams = queryClient.getQueryData<Team[]>(['teams']);
      
      queryClient.setQueryData<Team[]>(['teams'], (old) => {
        if (!old) return [];
        return old.filter(team => team._id !== id);
      });
      
      return { previousTeams };
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: ['teams', id] });
      queryClient.removeQueries({ queryKey: ['budgetStatus', id] });
      queryClient.removeQueries({ queryKey: ['insights', id] });
      queryClient.removeQueries({ queryKey: ['forecast', id] });
      
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
      toast.success('Team deleted successfully!');
    },
    onError: (_error, _id, context) => {
      if (context?.previousTeams) {
        queryClient.setQueryData(['teams'], context.previousTeams);
      }
      toast.error('Failed to delete team');
    },
  });
};
