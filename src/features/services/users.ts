import api from "@/lib/api";
import type {
  UsersListResponse,
  UsersQueryParams,
  UsersRequest,
  UserResponse,
} from "../types/users";

export const getUsers = async (
  params?: UsersQueryParams
): Promise<UsersListResponse> => {
  const response = await api.get<UsersListResponse>("/users", { params });
  return response.data;
};

export const createUser = async (data: UsersRequest): Promise<UserResponse> => {
  const response = await api.post<UserResponse>("/users", data);
  return response.data;
};

export const viewUser = async (id: string | number): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`/users/${id}`);
  return response.data;
};

export const updateUser = async (
  id: string | number,
  data: Partial<UsersRequest>
): Promise<UserResponse> => {
  const response = await api.put<UserResponse>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string | number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const getUserStats = async (): Promise<{
  total: number;
  active: number;
  inactive: number;
}> => {
  const response = await api.get<{
    total: number;
    active: number;
    inactive: number;
  }>("/users/stats/overview");
  return response.data;
};
