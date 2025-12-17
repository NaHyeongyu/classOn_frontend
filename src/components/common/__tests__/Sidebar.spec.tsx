import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../Sidebar";
import { vi } from "vitest";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: 7,
      role: "TEACHER",
      name: "테스트 강사",
      menus: ["DASHBOARD", "CALENDAR", "STUDENTS", "COURSES", "ATTENDANCE"],
      academy: { id: 1, name: "테스트 학원" },
    },
    logout: vi.fn(),
    authGeneration: 0,
  }),
}));

describe("Sidebar teacher view", () => {
  it("renders only teacher-allowed navigation items", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("대시보드")).toBeInTheDocument();
    expect(screen.getByText("수업관리")).toBeInTheDocument();
    expect(screen.queryByText("마케팅")).not.toBeInTheDocument();
    expect(screen.queryByText("오류/요청")).not.toBeInTheDocument();
  });
});
