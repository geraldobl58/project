import { memo } from "react";
import { Spinner } from "./ui/spinner";

interface LoadingProps {
  message?: string;
}

const LoadingComponent = ({ message }: LoadingProps) => {
  return (
    <div className="flex w-full items-center justify-center gap-4 py-20">
      <Spinner className="size-8" />
      {message && message}
    </div>
  );
};

export const Loading = memo(LoadingComponent);
