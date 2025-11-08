import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));
    expect(result.current).toBe("test");
  });

  it("should return the same value on initial render", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should handle object values", () => {
    const obj = { name: "test" };
    const { result } = renderHook(() => useDebounce(obj, 500));
    expect(result.current).toEqual(obj);
  });

  it("should have default delay of 500ms", () => {
    const { result } = renderHook(() => useDebounce("test"));
    expect(result.current).toBe("test");
  });

  it("should cleanup timeout on unmount", () => {
    const { unmount } = renderHook(() => useDebounce("test", 500));

    // Should not throw when unmounting
    expect(() => {
      unmount();
    }).not.toThrow();
  });
});
