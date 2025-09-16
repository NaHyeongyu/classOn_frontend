import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "onUnhandledRejection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                // Capture unhandled promise rejections to avoid blank screens
                this.setState({ hasError: true, error: e.reason || e });
            }
        });
        Object.defineProperty(this, "reload", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                window.location.reload();
            }
        });
        Object.defineProperty(this, "goHome", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                window.location.assign("/");
            }
        });
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        // Log for debugging in dev tools
        // eslint-disable-next-line no-console
        console.error("[ErrorBoundary] Caught error:", error, info);
    }
    componentDidMount() {
        window.addEventListener("unhandledrejection", this.onUnhandledRejection);
    }
    componentWillUnmount() {
        window.removeEventListener("unhandledrejection", this.onUnhandledRejection);
    }
    render() {
        if (this.state.hasError) {
            const message = summarize(String(this.state.error?.message ?? this.state.error ?? "알 수 없는 오류"));
            return (_jsx("div", { style: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#fff" }, children: _jsx("div", { style: { maxWidth: 720, padding: 16 }, children: _jsxs("div", { style: {
                            background: "#fee2e2",
                            border: "1px solid #fecaca",
                            color: "#7f1d1d",
                            borderRadius: 12,
                            padding: "16px 18px",
                            fontSize: 14,
                        }, children: [_jsx("strong", { style: { display: "block", marginBottom: 6 }, children: "\uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4." }), _jsx("div", { style: { whiteSpace: "pre-wrap" }, children: message }), _jsxs("div", { style: { marginTop: 12, display: "flex", gap: 8 }, children: [_jsx("button", { onClick: this.reload, style: btnStyle, children: "\uC0C8\uB85C\uACE0\uCE68" }), _jsx("button", { onClick: this.goHome, style: btnStyle, children: "\uD648\uC73C\uB85C" })] })] }) }) }));
        }
        return this.props.children;
    }
}
const btnStyle = {
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
function summarize(msg) {
    // Keep the first line and trim overly long messages
    const first = msg.split("\n")[0]?.trim() || msg.trim();
    return first.length > 300 ? first.slice(0, 300) + "…" : first;
}
