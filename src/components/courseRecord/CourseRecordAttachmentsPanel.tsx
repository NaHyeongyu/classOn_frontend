import styled from "styled-components";
import type { Attachment } from "@/api/courses";
import {
  AlertError,
  Hint,
  Muted,
  SmallBtn,
  SmallMuted,
} from "./CourseRecordStyles";

type UploadQueueItem = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export type CourseRecordAttachmentsPanelProps = {
  files: Attachment[];
  filesLoading: boolean;
  filesError: string | null;
  uploadQueue: UploadQueueItem[];
  previewBusy: Record<number, boolean>;
  fileBusy: Record<number, boolean>;
  thumbUrl: Record<number, string>;
  onUpload: (files: FileList | null) => void | Promise<void>;
  onDropFiles: (event: React.DragEvent<HTMLDivElement>) => void;
  openAttachment: (file: Attachment) => void | Promise<void>;
  onDeleteFile: (id: number, name: string) => void | Promise<void>;
  recordExists: boolean;
  maxFileSizeMb: number;
};

export function CourseRecordAttachmentsPanel(props: CourseRecordAttachmentsPanelProps) {
  const {
    files,
    filesLoading,
    filesError,
    uploadQueue,
    previewBusy,
    fileBusy,
    thumbUrl,
    onDropFiles,
    openAttachment,
    onDeleteFile,
    recordExists,
    maxFileSizeMb,
  } = props;
  return (
    <>
      <DropArea
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={onDropFiles}
      >
        <span className="hint">
          여기로 파일을 끌어다 놓거나 ‘파일 추가’를 누르세요
        </span>
      </DropArea>

      {uploadQueue.length > 0 && (
        <UploadQueue>
          {uploadQueue.map((item) => (
            <QueueItem key={item.id}>
              <div className="meta">
                <span className="name" title={item.name}>
                  {item.name}
                </span>
                <span className="size">{Math.round(item.size / 1024)} KB</span>
                <span className="status">{formatStatus(item.status)}</span>
              </div>
              <div className="bar">
                <i style={{ width: `${item.progress}%` }} />
              </div>
              {item.error && <SmallMuted>{item.error}</SmallMuted>}
            </QueueItem>
          ))}
        </UploadQueue>
      )}

      {filesError && <AlertError>{filesError}</AlertError>}
      {filesLoading && <Muted>불러오는 중...</Muted>}

      {files.length === 0 ? (
        <AttachEmpty>첨부 없음</AttachEmpty>
      ) : (
        <AttachGrid>
          {files.map((file) => {
            const isImg = (file.contentType || "").startsWith("image/");
            const isPdf =
              (file.contentType || "") === "application/pdf" ||
              /\.pdf$/i.test(file.filename);
            const url = thumbUrl[file.id];
            return (
              <AttachCard key={file.id}>
                <ThumbArea>
                  {isImg ? (
                    url ? (
                      <ThumbImg src={url} alt={file.filename} />
                    ) : (
                      <ThumbPlaceholder>이미지</ThumbPlaceholder>
                    )
                  ) : isPdf ? (
                    <ThumbPlaceholder>PDF</ThumbPlaceholder>
                  ) : (
                    <ThumbPlaceholder>FILE</ThumbPlaceholder>
                  )}
                </ThumbArea>
                <AttachMeta title={file.filename}>
                  <span className="name">{file.filename}</span>
                  <span className="size">
                    {Math.round((file.size ?? 0) / 1024)} KB
                  </span>
                </AttachMeta>
                <AttachActions>
                  <SmallBtn
                    onClick={() => void openAttachment(file)}
                    disabled={!!previewBusy[file.id]}
                  >
                    보기
                  </SmallBtn>
                  <SmallBtn
                    data-variant="danger"
                    disabled={!!fileBusy[file.id]}
                    onClick={() => void onDeleteFile(file.id, file.filename)}
                  >
                    삭제
                  </SmallBtn>
                </AttachActions>
              </AttachCard>
            );
          })}
        </AttachGrid>
      )}

      {!recordExists && <Hint>서버 기록이 없어 로컬에만 저장됩니다.</Hint>}
      <Hint>파일 크기 제한: 최대 {maxFileSizeMb}MB (이미지/PDF만 허용)</Hint>
      <Hint>원본파일이 클 경우 파일 인코딩을 통해 용량을 줄여주세요.</Hint>
    </>
  );
}

function formatStatus(status: UploadQueueItem["status"]): string {
  switch (status) {
    case "uploading":
      return "업로드 중";
    case "done":
      return "완료";
    case "error":
      return "오류";
    default:
      return "대기";
  }
}

const DropArea = styled.div`
  margin-top: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  text-align: center;
  .hint {
    pointer-events: none;
  }
`;

const UploadQueue = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 10px;
`;

const QueueItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px;
  background: #fff;
  display: grid;
  gap: 6px;
  .meta {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }
  .name {
    font-size: 12px;
    color: #111827;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  .size {
    font-size: 11px;
    color: #9ca3af;
  }
  .status {
    font-size: 11px;
    color: #6b7280;
  }
  .bar {
    height: 6px;
    background: #f3f4f6;
    border-radius: 999px;
    overflow: hidden;
  }
  .bar i {
    display: block;
    height: 100%;
    background: #a7f3d0;
  }
`;

const AttachEmpty = styled.div`
  color: #9ca3af;
  font-size: 13px;
  padding: 12px 0;
`;

const AttachGrid = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;

const AttachCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 10px;
  display: grid;
  gap: 8px;
`;

const ThumbArea = styled.div`
  height: 120px;
  border-radius: 8px;
  background: #f3f4f6;
  display: grid;
  place-items: center;
  overflow: hidden;
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ThumbPlaceholder = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

const AttachMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  .name {
    font-size: 12px;
    color: #111827;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .size {
    font-size: 11px;
    color: #9ca3af;
  }
`;

const AttachActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
