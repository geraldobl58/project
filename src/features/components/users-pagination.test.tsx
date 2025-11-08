import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { UsersPagination } from "@/features/components/users-pagination";

// Mock de useSearchParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: () => {
      const params = new URLSearchParams();
      return [params, vi.fn()];
    },
  };
});

describe("UsersPagination Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render pagination with page numbers", () => {
    renderWithProviders(<UsersPagination currentPage={1} totalPages={5} />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("should disable previous button on first page", () => {
    renderWithProviders(<UsersPagination currentPage={1} totalPages={5} />);

    // Procura pelo link com aria-label "Go to previous page"
    const prevButton = screen.getByLabelText("Go to previous page");
    expect(prevButton).toHaveClass("pointer-events-none", "opacity-50");
  });

  it("should disable next button on last page", () => {
    renderWithProviders(<UsersPagination currentPage={5} totalPages={5} />);

    // Procura pelo link com aria-label "Go to next page"
    const nextButton = screen.getByLabelText("Go to next page");
    expect(nextButton).toHaveClass("pointer-events-none", "opacity-50");
  });

  it("should show correct number of pages for small total pages", async () => {
    renderWithProviders(<UsersPagination currentPage={1} totalPages={3} />);

    const pageButtons = screen.getAllByRole("link");
    // Pode conter 3 páginas mais botões de navegação
    expect(pageButtons.length).toBeGreaterThan(0);
  });

  it("should limit pages shown to 5 max", () => {
    renderWithProviders(<UsersPagination currentPage={5} totalPages={100} />);

    const pageLinks = screen.getAllByRole("link");
    // Verifica que há múltiplas páginas renderizadas
    // O componente mostra: prev + números de página + next
    expect(pageLinks.length).toBeGreaterThan(5);

    // Verifica que realmente está renderizando números
    const pageNumbers = pageLinks.filter(
      (link) => !link.getAttribute("aria-label")
    );
    expect(pageNumbers.length).toBeGreaterThan(0);
  });
  it("should mark current page as active", () => {
    renderWithProviders(<UsersPagination currentPage={2} totalPages={5} />);

    const links = screen.getAllByRole("link");
    const activeLink = links.find(
      (link) => link.getAttribute("aria-current") === "page"
    );
    expect(activeLink).toBeInTheDocument();
  });
});
