import { fetchJSON } from "../lib/fetcher";
export async function getClassesOn(ymd) {
    const q = new URLSearchParams({ on: ymd });
    return await fetchJSON(`/api/calendar/classes?${q}`);
}
