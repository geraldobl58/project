import { memo, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UsersForm } from "@/features/components/users-form";
import { useViewUser } from "@/features/hooks/users";
import { Loading } from "@/components/loading";
import { AlertInformation } from "@/components/alert-information";
import { Button } from "@/components/ui/button";

const UsersCreateUpdateComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditMode = useMemo(() => !!id, [id]);
  const { user, isLoading, isError, error } = useViewUser(id || "");

  const handleSuccess = useCallback(() => {
    navigate("/users");
  }, [navigate]);

  const handleEditComplete = useCallback(() => {
    navigate("/users");
  }, [navigate]);

  const handleCancel = useCallback(() => {
    navigate("/users");
  }, [navigate]);

  const errorMessage = useMemo(() => error?.message, [error]);
  const pageTitle = useMemo(
    () => (isEditMode ? "Editar Usuário" : "Novo Usuário"),
    [isEditMode]
  );

  if (isEditMode && isLoading) {
    return (
      <div className="flex w-full items-center justify-center gap-4 py-20">
        <Loading message="Carregando dados do usuário..." />
      </div>
    );
  }

  if (isEditMode && isError) {
    return (
      <div className="w-full space-y-4">
        <AlertInformation
          variant="destructive"
          title="Houve um erro ao carregar o usuário."
          description={errorMessage}
        />
        <Button variant="outline" onClick={handleCancel}>
          Voltar para Lista
        </Button>
      </div>
    );
  }

  if (isEditMode && !user) {
    return (
      <div className="w-full space-y-4">
        <AlertInformation
          variant="destructive"
          title="Usuário não encontrado."
          description="O usuário solicitado não existe."
        />
        <Button variant="outline" onClick={handleCancel}>
          Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
      <UsersForm
        onSuccess={handleSuccess}
        editingUser={isEditMode ? user : null}
        onEditComplete={handleEditComplete}
      />
    </div>
  );
};

export const UsersCreateUpdate = memo(UsersCreateUpdateComponent);
