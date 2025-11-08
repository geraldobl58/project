import { useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UsersFilterProps {
  searchTerm: string;
  handleSearchChange: (term: string) => void;
}

const UsersFilterComponent = ({
  searchTerm,
  handleSearchChange,
}: UsersFilterProps) => {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearchChange(e.target.value);
    },
    [handleSearchChange]
  );

  const handleClear = useCallback(() => {
    handleSearchChange("");
  }, [handleSearchChange]);

  return (
    <div className="w-full mb-4 flex items-center justify-between gap-4">
      <Label htmlFor="search" className="font-medium">
        Nome:
      </Label>
      <Input id="search" value={searchTerm} onChange={handleInputChange} />
      <Button onClick={handleClear}>Limpar</Button>
    </div>
  );
};

export const UsersFilter = memo(UsersFilterComponent);
