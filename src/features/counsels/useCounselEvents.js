import { useCallback, useEffect, useMemo, useState } from "react";
import { listCounsels } from "../../api/counsels";
import { formatYMD } from "../calendar/dateUtils";
// Prefetch counsel counts for the currently visible dates.
export function useCounselEvents(visibleDates) {
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const ymds = useMemo(() => {
        if (!visibleDates || visibleDates.length === 0)
            return [];
        return visibleDates.map((d) => formatYMD(d));
    }, [visibleDates]);
    const range = useMemo(() => {
        if (!ymds.length)
            return null;
        const sorted = [...ymds].sort();
        return { from: sorted[0], to: sorted[sorted.length - 1] };
    }, [ymds]);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!range)
                return;
            setLoading(true);
            setError(null);
            try {
                const size = 200;
                let page = 0;
                let all = [];
                while (true) {
                    const res = await listCounsels({ from: range.from, to: range.to, page, size });
                    all = all.concat(res.content || []);
                    if (res.last || (res.content || []).length === 0 || page > 200)
                        break;
                    page += 1;
                }
                if (cancelled)
                    return;
                const map = {};
                for (const c of all) {
                    const day = (c.counselTime || "").slice(0, 10);
                    if (!day)
                        continue;
                    map[day] = (map[day] || 0) + 1;
                }
                setCounts(map);
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "상담 정보를 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [range]);
    const eventsForDate = useCallback((d) => {
        const ymd = formatYMD(d);
        const n = counts[ymd] || 0;
        return n > 0 ? [{ type: "counsel", label: `상담 ${n}개` }] : [];
    }, [counts]);
    return { eventsForDate, loading, error };
}
