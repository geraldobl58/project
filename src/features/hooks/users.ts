import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  UseUsersReturn,
  UseCreateUserReturn,
  UseUpdateUserReturn,
  UseDeleteUserReturn,
  UseViewUserReturn,
  UsersListResponse,
  UsersQueryParams,
  UsersRequest,
  UserResponse,
} from "../types/users";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  viewUser,
  getUserStats,
} from "../services/users";

export const useUsers = (params?: UsersQueryParams): UseUsersReturn => {
  const queryKey = ["users", params];

  const query = useQuery<UsersListResponse, Error>({
    queryKey,
    queryFn: async () => {
      return await getUsers(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (cache time)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refetch = useCallback(() => {
    void query.refetch();
  }, [query]);

  return {
    users: query.data?.data || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    limit: query.data?.limit || 10,
    totalPages: query.data?.totalPages || 1,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch,
  };
};

export const useCreateUser = (onSuccess?: () => void): UseCreateUserReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UsersRequest) => {
      return await createUser(data);
    },
    onSuccess: () => {
      // Invalidate all users queries to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
  });

  const mutate = useCallback(
    (data: UsersRequest) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  return {
    mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useViewUser = (id: string | number): UseViewUserReturn => {
  const query = useQuery<UserResponse, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      return await viewUser(id);
    },
    enabled: !!id, // Only run if id exists
    staleTime: 0, // Always refetch when component mounts
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });

  return {
    user: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  };
};

export const useUpdateUser = (onSuccess?: () => void): UseUpdateUserReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<UsersRequest>;
    }) => {
      return await updateUser(id, data);
    },
    onSuccess: () => {
      // Invalidate all users queries to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
  });

  const mutate = useCallback(
    (id: string | number, data: Partial<UsersRequest>) => {
      mutation.mutate({ id, data });
    },
    [mutation]
  );

  return {
    mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useDeleteUser = (onSuccess?: () => void): UseDeleteUserReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string | number) => {
      return await deleteUser(id);
    },
    onSuccess: () => {
      // Invalidate all users queries to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    },
  });

  const mutate = useCallback(
    (id: string | number) => {
      mutation.mutate(id);
    },
    [mutation]
  );

  return {
    mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useUserStats = () => {
  const query = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      return await getUserStats();
    },
  });

  return {
    total: query.data?.total || 0,
    active: query.data?.active || 0,
    inactive: query.data?.inactive || 0,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  };
};
