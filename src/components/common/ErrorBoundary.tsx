import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  private onUnhandledRejection = (e: PromiseRejectionEvent) => {
    // Capture unhandled promise rejections to avoid blank screens
    this.setState({ hasError: true, error: e.reason || e });
  };

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Log for debugging in dev tools
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  componentDidMount(): void {
    window.addEventListener("unhandledrejection", this.onUnhandledRejection);
  }

  componentWillUnmount(): void {
    window.removeEventListener("unhandledrejection", this.onUnhandledRejection);
  }

  private reload = () => {
    window.location.reload();
  };

  private goHome = () => {
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      const message = summarize(String(this.state.error?.message ?? this.state.error ?? "알 수 없는 오류"));
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#fff" }}>
          <div style={{ maxWidth: 720, padding: 16 }}>
            <div style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#7f1d1d",
              borderRadius: 12,
              padding: "16px 18px",
              fontSize: 14,
            }}>
              <strong style={{ display: "block", marginBottom: 6 }}>문제가 발생했습니다.</strong>
              <div style={{ whiteSpace: "pre-wrap" }}>{message}</div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button onClick={this.reload} style={btnStyle}>새로고침</button>
                <button onClick={this.goHome} style={btnStyle}>홈으로</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

const btnStyle: React.CSSProperties = {
  height: 32,
  padding: "0 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#111827",
  fontWeight: 800,
  fontSize: 12,
  cursor: "pointer",
};

function summarize(msg: string) {
  // Keep the first line and trim overly long messages
  const first = msg.split("\n")[0]?.trim() || msg.trim();
  return first.length > 300 ? first.slice(0, 300) + "…" : first;
}

