import { describe, expect, it } from "vitest";
import { combineMemoValues } from "./paymentsUtils";

describe("combineMemoValues", () => {
  it("deduplicates identical memo values", () => {
    expect(combineMemoValues("hello", "hello")).toBe("hello");
  });

  it("trims and deduplicates", () => {
    expect(combineMemoValues(" hello ", "hello")).toBe("hello");
  });

  it("combines different values with newline", () => {
    expect(combineMemoValues("a", "b")).toBe("a\nb");
  });

  it("handles empty and null inputs", () => {
    expect(combineMemoValues(null, "b")).toBe("b");
    expect(combineMemoValues("a", "")).toBe("a");
  });
});

