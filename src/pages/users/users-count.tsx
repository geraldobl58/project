import { memo, useMemo } from "react";

interface UsersCountProps {
  total: number;
  active: number;
  inactive: number;
}

const UsersCountComponent = ({ total, active, inactive }: UsersCountProps) => {
  const stats = useMemo(
    () => [
      { label: "Total de usuários", value: total },
      { label: "Usuários ativos", value: active },
      { label: "Usuários inativos", value: inactive },
    ],
    [total, active, inactive]
  );

  return (
    <div className="flex items-center justify-between mt-10 p-4 border rounded-md bg-gray-50">
      {stats.map((stat) => (
        <p key={stat.label}>
          {stat.label}: {stat.value}
        </p>
      ))}
    </div>
  );
};

export const UsersCount = memo(UsersCountComponent);
