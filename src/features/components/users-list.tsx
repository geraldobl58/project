import { useCallback, useEffect, useState, useMemo, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Edit, Eye, Trash } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDebounce } from "@/hooks/useDebounce";
import { useUsers, useDeleteUser } from "../hooks/users";
import { UsersPagination } from "./users-pagination";
import { AlertInformation } from "@/components/alert-information";
import { Loading } from "@/components/loading";
import { UsersFilter } from "./users-filter";
import { Button } from "@/components/ui/button";

const UsersListComponent = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1", 10),
    [searchParams]
  );
  const itemsPerPage = 5; // Fixo em 5

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { users, isLoading, isError, error, totalPages, refetch } = useUsers({
    search: debouncedSearchTerm,
    page: currentPage,
    limit: itemsPerPage,
  });

  const { mutate: deleteUserMutate, isPending: isDeletingPending } =
    useDeleteUser(refetch);

  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      // Reset to page 1 when searching
      const params = new URLSearchParams();
      if (term) params.set("search", term);
      params.set("page", "1");
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  // Update URL when search term or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    params.set("page", String(currentPage));
    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, currentPage, setSearchParams]);

  const handleDelete = useCallback(
    (userId: string | number) => {
      if (confirm("Tem certeza que deseja deletar este usuário?")) {
        deleteUserMutate(userId);
      }
    },
    [deleteUserMutate]
  );

  const handleViewUser = useCallback(
    (userId: string | number) => {
      navigate(`/users/${userId}`);
    },
    [navigate]
  );

  const handleEditUser = useCallback(
    (userId: string | number) => {
      navigate(`/users/${userId}/edit`);
    },
    [navigate]
  );

  const handleCreateUser = useCallback(() => {
    navigate("/users/create");
  }, [navigate]);

  const tableRows = useMemo(
    () =>
      users.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.id}</TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.username}</TableCell>
          <TableCell>{user.phone}</TableCell>
          <TableCell>{user.city}</TableCell>
          <TableCell>{user.active ? "Ativo" : "Inativo"}</TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="icon"
                onClick={() => handleViewUser(user.id)}
              >
                <Eye className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditUser(user.id)}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(user.id)}
                disabled={isDeletingPending}
              >
                <Trash className="size-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )),
    [users, handleViewUser, handleEditUser, handleDelete, isDeletingPending]
  );

  if (isError) {
    return (
      <div className="w-full">
        <AlertInformation
          variant="destructive"
          title="Houve um erro ao carregar os usuários."
          description={error?.message}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Button onClick={handleCreateUser}>Novo Usuário</Button>
      </div>
      <UsersFilter
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      {isLoading ? (
        <div className="flex w-full items-center justify-center gap-4 py-20">
          <Loading message="Carregando dados dos usuários..." />
        </div>
      ) : (
        <>
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                tableRows
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4">
            <UsersPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
};

export const UsersList = memo(UsersListComponent);
