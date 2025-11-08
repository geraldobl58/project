import { useCallback, useEffect, useMemo, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { userSchema, type UserFormData } from "../schemas/users";
import { useCreateUser, useUpdateUser } from "../hooks/users";
import type { UserResponse } from "../types/users";

interface UsersFormProps {
  onSuccess?: () => void;
  editingUser?: UserResponse | null;
  onEditComplete?: () => void;
}

const UsersFormComponent = ({
  onSuccess,
  editingUser,
  onEditComplete,
}: UsersFormProps) => {
  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateUser(onSuccess);
  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateUser(onSuccess);

  const isEditing = useMemo(() => !!editingUser, [editingUser]);
  const isPending = useMemo(
    () => isPendingCreate || isPendingUpdate,
    [isPendingCreate, isPendingUpdate]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      phone: "",
      city: "",
    },
  });

  useEffect(() => {
    if (editingUser) {
      setValue("name", editingUser.name);
      setValue("email", editingUser.email);
      setValue("username", editingUser.username);
      setValue("phone", editingUser.phone);
      setValue("city", editingUser.city);
    } else {
      reset();
    }
  }, [editingUser, setValue, reset]);

  const onSubmit = useCallback(
    (data: UserFormData) => {
      if (isEditing && editingUser) {
        mutateUpdate(editingUser.id, data);
      } else {
        mutateCreate(data);
      }
    },
    [isEditing, editingUser, mutateUpdate, mutateCreate]
  );

  const handleCancel = useCallback(() => {
    reset();
    onEditComplete?.();
  }, [reset, onEditComplete]);

  const buttonLabel = useMemo(() => {
    if (isPending) {
      return isEditing ? "Atualizando..." : "Salvando...";
    }
    return isEditing ? "Atualizar Usuário" : "Salvar Usuário";
  }, [isPending, isEditing]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="name">Nome:</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Digite o nome"
            className="w-full"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            {...register("email")}
            placeholder="Digite o email"
            className="w-full"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="username">Usuário:</Label>
          <Input
            id="username"
            {...register("username")}
            placeholder="Digite o usuário"
            className="w-full"
          />
          {errors.username && (
            <p className="text-sm text-red-600 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone:</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Digite o telefone"
            className="w-full"
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city">Cidade:</Label>
          <Input
            id="city"
            {...register("city")}
            placeholder="Digite a cidade"
            className="w-full"
          />
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="mt-4" disabled={isPending}>
            {buttonLabel}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export const UsersForm = memo(UsersFormComponent);
