import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { useUsers, useCreateUser, useDeleteUser } from "@/features/hooks/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import * as userService from "@/features/services/users";

// Mock dos serviços
vi.mock("@/features/services/users", () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  viewUser: vi.fn(),
  getUserStats: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => {
    const testQueryClient = createTestQueryClient();
    return React.createElement(
      QueryClientProvider,
      { client: testQueryClient },
      React.createElement(BrowserRouter, null, children)
    );
  };
};

describe("Users Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useUsers", () => {
    it("should return initial empty state", () => {
      const mockUsers = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

      const { result } = renderHook(() => useUsers({ page: 1, limit: 10 }), {
        wrapper: createWrapper(),
      });

      expect(result.current.users).toEqual([]);
      expect(result.current.total).toBe(0);
    });

    it("should have a refetch function", () => {
      const mockUsers = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

      const { result } = renderHook(() => useUsers({ page: 1, limit: 10 }), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.refetch).toBe("function");
    });
  });

  describe("useCreateUser", () => {
    it("should return mutate function", () => {
      const { result } = renderHook(() => useCreateUser(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe("function");
      expect(result.current.isPending).toBe(false);
    });
  });

  describe("useDeleteUser", () => {
    it("should return mutate function", () => {
      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe("function");
      expect(result.current.isPending).toBe(false);
    });
  });
});
