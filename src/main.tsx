import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "@/styles/theme";
import "./index.css";
import "@/styles/reset.css";
import App from "@/App.tsx";
import ErrorBoundary from "@/components/common/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={defaultTheme}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
