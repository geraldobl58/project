import { memo, useMemo } from "react";
import { AlertInformation } from "@/components/alert-information";
import { Loading } from "@/components/loading";
import { UsersList } from "@/features/components/users-list";
import { useUserStats } from "@/features/hooks/users";
import { UsersCount } from "./users-count";

const UsersPageComponent = () => {
  const { total, active, inactive, isLoading, isError, error } = useUserStats();

  const errorMessage = useMemo(() => error?.message, [error]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center gap-4 py-20">
        <Loading message="Carregando estatísticas de usuários..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full space-y-4">
        <AlertInformation
          variant="destructive"
          title="Houve um erro ao carregar as estatísticas de usuários."
          description={errorMessage}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <UsersList />
      <UsersCount total={total} active={active} inactive={inactive} />
    </div>
  );
};

export const UsersPage = memo(UsersPageComponent);
