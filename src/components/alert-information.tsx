import { memo } from "react";
import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertInformationProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

const AlertInformationComponent = ({
  title,
  description,
  variant = "destructive",
}: AlertInformationProps) => {
  return (
    <div className="w-full gap-4">
      <Alert variant={variant}>
        <AlertCircleIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p>{description}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const AlertInformation = memo(AlertInformationComponent);
