// Utility helpers for pagination UIs
export function visiblePages(current, total, span = 5) {
    const half = Math.floor(span / 2);
    let start = Math.max(0, current - half);
    let end = Math.min(total - 1, start + span - 1);
    start = Math.max(0, end - span + 1);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
}
