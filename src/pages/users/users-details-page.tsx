import { memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useViewUser } from "@/features/hooks/users";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "@/components/loading";
import { AlertInformation } from "@/components/alert-information";

const UsersDetailsPageComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { user, isLoading, isError, error } = useViewUser(id || "");

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const errorMessage = useMemo(() => error?.message, [error]);

  const formattedDates = useMemo(() => {
    if (!user) return null;
    return {
      createdAt: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("pt-BR")
        : null,
      updatedAt: user.updatedAt
        ? new Date(user.updatedAt).toLocaleDateString("pt-BR")
        : null,
    };
  }, [user]);

  const userInfo = useMemo(() => {
    if (!user) return [];
    return [
      { label: "ID", value: user.id },
      { label: "Email", value: user.email },
      { label: "Usuário", value: user.username },
      { label: "Telefone", value: user.phone },
      { label: "Cidade", value: user.city },
    ];
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center gap-4 py-20">
        <Loading message="Carregando detalhes do usuário..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full">
        <AlertInformation
          variant="destructive"
          title="Houve um erro ao carregar o usuário."
          description={errorMessage}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full">
        <AlertInformation
          variant="destructive"
          title="Usuário não encontrado."
          description="O usuário solicitado não existe."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="default" onClick={handleGoBack}>
          Voltar
        </Button>
      </div>
      <div className="mt-4">
        <h1 className="text-3xl font-bold mb-6">{user.name}</h1>
        <div className="grid grid-cols-2 gap-4">
          {userInfo.map((info) => (
            <div key={info.label}>
              <p className="text-sm font-semibold text-gray-600">
                {info.label}
              </p>
              <p className="text-lg">{info.value}</p>
            </div>
          ))}
          <div>
            <p className="text-sm font-semibold text-gray-600">Status</p>
            <p className="text-lg">
              {user.active ? (
                <span className="text-green-600 font-semibold">Ativo</span>
              ) : (
                <span className="text-red-600 font-semibold">Inativo</span>
              )}
            </p>
          </div>
          {formattedDates?.createdAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600">Criado em</p>
              <p className="text-lg">{formattedDates.createdAt}</p>
            </div>
          )}
          {formattedDates?.updatedAt && (
            <div>
              <p className="text-sm font-semibold text-gray-600">
                Atualizado em
              </p>
              <p className="text-lg">{formattedDates.updatedAt}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const UsersDetailsPage = memo(UsersDetailsPageComponent);
