export interface UserResponse {
  id: string | number;
  name: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersRequest {
  name: string;
  email: string;
  username: string;
  phone: string;
  city: string;
  active?: boolean;
}

export interface UsersListResponse {
  data: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UseUsersReturn {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseCreateUserReturn {
  mutate: (data: UsersRequest) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export interface UseUpdateUserReturn {
  mutate: (id: string | number, data: Partial<UsersRequest>) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export interface UseDeleteUserReturn {
  mutate: (id: string | number) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export interface UseViewUserReturn {
  user: UserResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}
