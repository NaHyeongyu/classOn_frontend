import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getProgress, getResult, uploadPhotos, type ResultCluster, type ResultOriginal } from "../api/photos";

export default function PhotoExtract() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [phase, setPhase] = useState<string>("대기");
  const [percent, setPercent] = useState<number>(0);
  const [counts, setCounts] = useState<{ photos_done?: number; faces_done?: number; faces_total_est?: number }>();
  const [clusters, setClusters] = useState<ResultCluster[]>([]);
  const [unassigned, setUnassigned] = useState<ResultOriginal[]>([]);
  const timerRef = useRef<number | null>(null);
  const [toast, setToast] = useState<{ type: "info" | "error" | "success"; message: string } | null>(null);

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); }, []);

  const onFiles = (list: FileList | File[]) => {
    const arr = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles(arr);
  };

  const start = async () => {
    if (!files.length) { setToast({ type: "error", message: "사진 파일을 선택하세요." }); return; }
    try {
      setBusy(true);
      setPhase("업로드"); setPercent(0);
      const { job_id } = await uploadPhotos(files);
      setJobId(job_id);
      poll(job_id);
    } catch (e: any) {
      setBusy(false);
      setToast({ type: "error", message: `업로드 실패: ${e?.message ?? e}` });
    }
  };

  const poll = (id: string) => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(async () => {
      try {
        const s = await getProgress(id);
        setPhase(s.phase || "진행중");
        const pct = Math.max(0, Math.min(100, Math.round((s.progress || 0) * 100)));
        setPercent(pct);
        setCounts(s.counts);
        if (pct >= 100 || s.phase === "done") {
          if (timerRef.current) window.clearInterval(timerRef.current);
          await loadResult(id);
          setBusy(false);
        }
      } catch (e) {
        // transient errors are ignored briefly
      }
    }, 800) as any;
  };

  const loadResult = async (id: string) => {
    try {
      const data = await getResult(id);
      setClusters(data.clusters || []);
      setUnassigned(data.unassigned || []);
      setToast({ type: "success", message: "완료되었습니다." });
    } catch (e: any) {
      setToast({ type: "error", message: `결과 로딩 실패: ${e?.message ?? e}` });
    }
  };

  return (
    <Wrap>
      <h2>사진 추출</h2>
      {toast && <Toast role="status" className={toast.type}>{toast.message}</Toast>}

      <Card>
        <Dropzone
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") (e.target as HTMLElement).querySelector<HTMLInputElement>("input[type=file]")?.click(); }}
          aria-label="사진 드래그 또는 클릭하여 선택"
        >
          <div>📁 사진을 드래그 앤 드롭하거나 클릭하여 선택</div>
          <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && onFiles(e.target.files)} />
        </Dropzone>
        <Actions>
          <button onClick={() => document.querySelector<HTMLInputElement>("input[type=file]")?.click()} disabled={busy}>파일 선택</button>
          <button className="primary" onClick={start} disabled={busy || !files.length}>업로드 시작</button>
          <span className="muted">{files.length ? `${files.length}개 선택됨` : ""}</span>
        </Actions>
      </Card>

      <Card>
        <Head>
          <span>단계: {phase}</span>
          <span>{percent}%</span>
        </Head>
        <Bar><BarInner style={{ width: `${percent}%` }} /></Bar>
        {counts && (counts.photos_done || counts.faces_done) ? (
          <Sub>{`사진 ${counts.photos_done ?? 0} / 얼굴 ${counts.faces_done ?? 0}${counts.faces_total_est ? ` (예상 ${counts.faces_total_est})` : ""}`}</Sub>
        ) : null}
      </Card>

      <Section>
        <h3>인물별 사진</h3>
        <Cards>
          {clusters.length === 0 && <Empty>클러스터가 없습니다.</Empty>}
          {clusters.map((c, i) => (
            <ClusterCard key={c.cluster_id}>
              <ClusterHead>
                <strong>{c.name || `인물 ${i + 1}`}</strong>
                <Badge>{c.originals?.length ?? 0}</Badge>
              </ClusterHead>
              <Grid>
                {(c.originals || []).map((o, idx) => (
                  <a key={idx} href={o.photo} target="_blank" rel="noopener" title="원본 열기">
                    <img className="thumb" src={o.thumb || o.photo} alt={`${c.name || `인물 ${i + 1}`} 원본 썸네일 ${idx + 1}`} />
                  </a>
                ))}
              </Grid>
            </ClusterCard>
          ))}
        </Cards>
      </Section>

      <Section>
        <h3>분리되지 않은 사진</h3>
        <Grid>
          {unassigned.length === 0 && <Empty>없음</Empty>}
          {unassigned.map((o, i) => (
            <a key={i} href={o.photo} target="_blank" rel="noopener" title="원본 열기">
              <img className="thumb" src={o.thumb || o.photo} alt={`분리되지 않은 원본 썸네일 ${i + 1}`} />
            </a>
          ))}
        </Grid>
      </Section>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  gap: 16px;
`;
const Card = styled.section`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;
const Dropzone = styled.div`
  position: relative;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #6b7280;
  outline: none;
  &:focus { box-shadow: 0 0 0 2px #e5e7eb inset; }
  input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
`;
const Actions = styled.div`
  display: flex; gap: 8px; align-items: center; margin-top: 12px;
  button { height: 36px; padding: 0 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #f9fafb; cursor: pointer; }
  button.primary { background: #2563eb; color: #fff; border-color: #2563eb; }
  button:disabled { opacity: .5; cursor: not-allowed; }
  .muted { color: #6b7280; font-size: 13px; }
`;
const Head = styled.div`
  display: flex; justify-content: space-between; color: #6b7280; font-size: 14px; margin-bottom: 8px;
`;
const Bar = styled.div`
  width: 100%; height: 10px; background: #f3f4f6; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb;
`;
const BarInner = styled.div`
  height: 100%; background: linear-gradient(90deg,#2563eb,#60a5fa); transition: width .2s ease;
`;
const Sub = styled.div`
  color: #6b7280; font-size: 12px; margin-top: 8px;
`;
const Section = styled.section``;
const Cards = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: 12px;
`;
const ClusterCard = styled.div`
  border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff;
`;
const ClusterHead = styled.div`
  display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid #e5e7eb;
`;
const Badge = styled.span`
  background: #f3f4f6; color: #6b7280; font-size: 12px; border: 1px solid #e5e7eb; border-radius: 999px; padding: 2px 8px;
`;
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill,minmax(120px,1fr)); gap: 8px; padding: 10px;
  img.thumb { width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb; }
`;
const Empty = styled.div`
  color: #9ca3af; padding: 12px;
`;
const Toast = styled.div`
  background: #111827; color: #f9fafb; border-left: 4px solid #2563eb; padding: 8px 12px; border-radius: 6px;
  &.success { border-left-color: #16a34a; }
  &.error { border-left-color: #e11d48; }
`;

