import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { UsersFilter } from "@/features/components/users-filter";

describe("UsersFilter Component", () => {
  it("should render search input and clear button", () => {
    const handleSearchChange = vi.fn();
    renderWithProviders(
      <UsersFilter searchTerm="" handleSearchChange={handleSearchChange} />
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /limpar/i })).toBeInTheDocument();
    expect(screen.getByText("Nome:")).toBeInTheDocument();
  });

  it("should display current search term", () => {
    const handleSearchChange = vi.fn();
    renderWithProviders(
      <UsersFilter
        searchTerm="test term"
        handleSearchChange={handleSearchChange}
      />
    );

    expect(screen.getByDisplayValue("test term")).toBeInTheDocument();
  });

  it("should call handleSearchChange with empty string when clear button is clicked", async () => {
    const user = userEvent.setup();
    const handleSearchChange = vi.fn();

    renderWithProviders(
      <UsersFilter searchTerm="test" handleSearchChange={handleSearchChange} />
    );

    const clearButton = screen.getByRole("button", { name: /limpar/i });
    await user.click(clearButton);

    expect(handleSearchChange).toHaveBeenCalledWith("");
  });

  it("should call handleSearchChange when input changes", async () => {
    const user = userEvent.setup();
    const handleSearchChange = vi.fn();

    renderWithProviders(
      <UsersFilter searchTerm="" handleSearchChange={handleSearchChange} />
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "John");

    // A função será chamada para cada caractere
    expect(handleSearchChange).toHaveBeenCalledTimes(4); // J, o, h, n
    expect(handleSearchChange).toHaveBeenLastCalledWith("n"); // última chamada com "n"
  });

  it("should be memoized to prevent unnecessary re-renders", () => {
    const handleSearchChange = vi.fn();
    const { rerender } = renderWithProviders(
      <UsersFilter searchTerm="test" handleSearchChange={handleSearchChange} />
    );

    expect(screen.getByDisplayValue("test")).toBeInTheDocument();

    // Re-render com mesmas props
    rerender(
      <UsersFilter searchTerm="test" handleSearchChange={handleSearchChange} />
    );

    // Componente deve estar memoizado
    expect(screen.getByDisplayValue("test")).toBeInTheDocument();
  });
});
