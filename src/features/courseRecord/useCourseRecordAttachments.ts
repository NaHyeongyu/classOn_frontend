import { useCallback, useEffect, useRef, useState } from "react";
import {
  listRecordAttachments,
  presignRecordAttachment,
  confirmRecordAttachment,
  deleteRecordAttachment,
  getRecordAttachmentDownloadUrl,
  type Attachment,
} from "@/api/courses";
import { readableError } from "@/lib/errors";

type UseAttachmentsOptions = {
  courseId: number | null;
  recordId: number | null;
  recId: number | null;
  ymd?: string | null;
  maxFileSizeMB: number;
  allowedMime: Set<string>;
  showError: (message: string) => void;
};

type UploadQueueItem = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export function useCourseRecordAttachments({
  courseId,
  recordId,
  recId,
  ymd,
  maxFileSizeMB,
  allowedMime,
  showError,
}: UseAttachmentsOptions) {
  const [files, setFiles] = useState<Attachment[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [fileBusy, setFileBusy] = useState<Record<number, boolean>>({});
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [thumbUrl, setThumbUrl] = useState<Record<number, string>>({});
  const thumbUrlRef = useRef<Record<number, string>>({});
  const [previewBusy, setPreviewBusy] = useState<Record<number, boolean>>({});

  const localAttachKey = useCallback(() => {
    if (!courseId) return `attachments::`;
    if (recId) return `attachments:${courseId}:${recId}`;
    if (ymd) return `attachmentsDate:${courseId}:${ymd}`;
    return `attachments:${courseId}:`;
  }, [courseId, recId, ymd]);

  const getLocalAttachments = useCallback((): { name: string; size: number }[] => {
    try {
      return JSON.parse(localStorage.getItem(localAttachKey()) || "[]");
    } catch {
      return [];
    }
  }, [localAttachKey]);

  const setLocalAttachments = useCallback(
    (list: { name: string; size: number }[]) => {
      try {
        localStorage.setItem(localAttachKey(), JSON.stringify(list));
      } catch {
        // ignore quota errors
      }
    },
    [localAttachKey]
  );

  const toAttachmentRows = useCallback((list: { name: string; size: number }[]): Attachment[] => {
    const now = new Date().toISOString();
    return list.map((item, idx) => ({
      id: -1 - idx,
      filename: item.name,
      size: item.size,
      createdAt: now,
    }));
  }, []);

  useEffect(() => {
    thumbUrlRef.current = thumbUrl;
  }, [thumbUrl]);

  const preloadThumbs = useCallback(
    async (list: Attachment[]) => {
      if (!courseId || !recordId) return;
      const imgs = list.filter((file) => (file.contentType || "").startsWith("image/"));
      const limit = 3;
      let idx = 0;
      const run = async () => {
        while (idx < imgs.length) {
          const current = imgs[idx++];
          if (thumbUrlRef.current[current.id]) continue;
          try {
            setPreviewBusy((map) => ({ ...map, [current.id]: true }));
            const url =
              current.downloadUrl ||
              (
                await getRecordAttachmentDownloadUrl(
                  courseId,
                  recordId,
                  current.id
                )
              ).url;
            setThumbUrl((map) => ({ ...map, [current.id]: url }));
          } catch (error) {
            if (import.meta.env.DEV) {
              console.debug("첨부 미리보기 로드 실패", error);
            }
          } finally {
            setPreviewBusy((map) => ({ ...map, [current.id]: false }));
          }
        }
      };
      await Promise.all(
        Array.from({ length: Math.min(limit, imgs.length) }, () => run())
      );
    },
    [courseId, recordId]
  );

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    (async () => {
      setFilesError(null);
      if (recordId) {
        setFilesLoading(true);
        try {
          const list = await listRecordAttachments(courseId, recordId, {
            presign: true,
          });
          if (!cancelled) {
            setFiles(list);
            void preloadThumbs(list);
          }
        } catch (error) {
          if (!cancelled) {
            setFilesError(readableError(error, "첨부를 불러오지 못했습니다."));
          }
        } finally {
          if (!cancelled) setFilesLoading(false);
        }
      } else {
        const local = getLocalAttachments();
        setFiles(toAttachmentRows(local));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, recordId, recId, ymd, getLocalAttachments, toAttachmentRows, preloadThumbs]);

  const filterIncoming = useCallback(
    (filesList: FileList | File[]) => {
      const maxBytes = maxFileSizeMB * 1024 * 1024;
      const all = Array.from(filesList);
      const sized = all.filter((file) => file.size <= maxBytes);
      const rejectedSize = all.filter((file) => file.size > maxBytes);
      const accepted = sized.filter((file) => !file.type || allowedMime.has(file.type));
      const rejectedType = sized.filter(
        (file) => file.type && !allowedMime.has(file.type)
      );
      if (rejectedSize.length > 0) {
        setFilesError(
          `용량 제한(${maxFileSizeMB}MB)을 초과한 파일 제외: ${rejectedSize
            .map((file) => file.name)
            .join(", ")}`
        );
      } else {
        setFilesError(null);
      }
      if (rejectedType.length > 0) {
        setFilesError((prev) =>
          [
            prev,
            `허용되지 않는 형식 제외: ${rejectedType
              .map((file) => file.name)
              .join(", ")}`,
          ]
            .filter(Boolean)
            .join(" / ")
        );
      }
      return accepted;
    },
    [allowedMime, maxFileSizeMB]
  );

  const startUpload = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return;
      if (!(courseId && recordId)) {
        const prev = getLocalAttachments();
        const next = [
          ...prev,
          ...accepted.map((file) => ({ name: file.name, size: file.size })),
        ];
        setLocalAttachments(next);
        setFiles(toAttachmentRows(next));
        return;
      }
      const MAX_FILES = 8;
      const CONCURRENCY = 3;
      const send = accepted.slice(0, MAX_FILES);
      const omitted = accepted.length - send.length;
      if (omitted > 0) {
        setFilesError((prev) =>
          [
            prev,
            `최대 ${MAX_FILES}개까지만 업로드됩니다 (추가 ${omitted}개 제외)`,
          ]
            .filter(Boolean)
            .join(" / ")
        );
      }
      const newItems: UploadQueueItem[] = send.map((file, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "pending",
      }));
      setUploadQueue((queue) => [...newItems, ...queue]);
      const created: Attachment[] = [];
      let idx = 0;
      const uploadOne = async (index: number) => {
        const file = send[index];
        const queueId = newItems[index].id;
        let pres: Awaited<ReturnType<typeof presignRecordAttachment>>;
        try {
          pres = await presignRecordAttachment(
            courseId,
            recordId,
            file.name,
            file.type || "application/octet-stream"
          );
        } catch (error) {
          const message = readableError(
            error,
            "첨부 파일 업로드를 사용할 수 없습니다."
          );
          setFilesError(message);
          setUploadQueue((queue) =>
            queue.map((item) =>
              item.id === queueId
                ? { ...item, status: "error", error: message }
                : item
            )
          );
          throw error;
        }
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", pres.url, true);
          for (const [key, value] of Object.entries(pres.headers || {})) {
            try {
              xhr.setRequestHeader(key, value as string);
            } catch (error) {
              if (import.meta.env.DEV) {
                console.debug("업로드 요청 헤더 설정 실패", error);
              }
            }
          }
          setUploadQueue((queue) =>
            queue.map((item) =>
              item.id === queueId
                ? { ...item, status: "uploading", progress: 0 }
                : item
            )
          );
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const pct = Math.max(
                1,
                Math.min(99, Math.round((event.loaded / event.total) * 100))
              );
              setUploadQueue((queue) =>
                queue.map((item) =>
                  item.id === queueId ? { ...item, progress: pct } : item
                )
              );
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadQueue((queue) =>
                queue.map((item) =>
                  item.id === queueId ? { ...item, progress: 100 } : item
                )
              );
              resolve();
            } else {
              const err = `S3 업로드 실패: HTTP ${xhr.status}`;
              setUploadQueue((queue) =>
                queue.map((item) =>
                  item.id === queueId
                    ? { ...item, status: "error", error: err }
                    : item
                )
              );
              reject(new Error(err));
            }
          };
          xhr.onerror = () => {
            const err = "S3 업로드 중 네트워크 오류";
            setUploadQueue((queue) =>
              queue.map((item) =>
                item.id === queueId
                  ? { ...item, status: "error", error: err }
                  : item
              )
            );
            reject(new Error(err));
          };
          xhr.send(file);
        });
        const meta = await confirmRecordAttachment(courseId, recordId, {
          key: pres.key,
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          size: file.size,
          etag: undefined,
          originalName: file.name,
        });
        created.push(meta);
        setUploadQueue((queue) =>
          queue.map((item) =>
            item.id === queueId ? { ...item, status: "done", progress: 100 } : item
          )
        );
      };
      const workers = Array.from(
        { length: Math.min(CONCURRENCY, send.length) },
        async () => {
          while (idx < send.length) {
            const current = idx++;
            try {
              await uploadOne(current);
            } catch (error) {
              if (import.meta.env.DEV) {
                console.debug("첨부 업로드 실패", error);
              }
            }
          }
        }
      );
      await Promise.all(workers);
      if (created.length) {
        setFiles((prev) => [...created, ...prev]);
        void preloadThumbs(created);
      }
      window.setTimeout(() => {
        setUploadQueue((queue) =>
          queue.filter((item) => item.status !== "done" && item.status !== "error")
        );
      }, 2500);
    },
    [courseId, recordId, getLocalAttachments, setLocalAttachments, toAttachmentRows, preloadThumbs]
  );

  const onUpload = useCallback(
    async (filesList: FileList | null) => {
      if (!filesList) return;
      const accepted = filterIncoming(filesList);
      await startUpload(accepted);
    },
    [filterIncoming, startUpload]
  );

  const onDropFiles = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const items = event.dataTransfer?.files;
      if (!items || items.length === 0) return;
      const accepted = filterIncoming(items);
      await startUpload(accepted);
    },
    [filterIncoming, startUpload]
  );

  useEffect(() => {
    return () => {
      Object.values(thumbUrl).forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          if (import.meta.env.DEV) {
            console.debug("첨부 미리보기 URL 해제 실패", error);
          }
        }
      });
    };
  }, [thumbUrl]);

  const openAttachment = useCallback(
    async (attachment: Attachment) => {
      if (!courseId || !recordId) return;
      try {
        setPreviewBusy((map) => ({ ...map, [attachment.id]: true }));
        const url =
          attachment.downloadUrl ||
          (await getRecordAttachmentDownloadUrl(courseId, recordId, attachment.id)).url;
        window.open(url, "_blank", "noopener");
      } catch (error) {
        showError(readableError(error, "파일을 열 수 없습니다."));
      } finally {
        setPreviewBusy((map) => ({ ...map, [attachment.id]: false }));
      }
    },
    [courseId, recordId, showError]
  );

  const onDeleteFile = useCallback(
    async (fileId: number, name?: string) => {
      const msg = name
        ? `"${name}" 파일을 삭제합니다. 되돌릴 수 없습니다.`
        : "선택한 파일을 삭제합니다. 되돌릴 수 없습니다.";
      const confirmed = window.confirm(msg);
      if (!confirmed) return;
      if (courseId && recordId) {
        setFileBusy((map) => ({ ...map, [fileId]: true }));
        try {
          await deleteRecordAttachment(courseId, recordId, fileId);
          setFiles((prev) => prev.filter((file) => file.id !== fileId));
        } catch (error) {
          showError(readableError(error, "삭제에 실패했습니다."));
        } finally {
          setFileBusy((map) => ({ ...map, [fileId]: false }));
        }
      } else {
        const prev = getLocalAttachments();
        const next = prev.filter((item) => item.name !== name);
        setLocalAttachments(next);
        setFiles(toAttachmentRows(next));
      }
    },
    [courseId, recordId, getLocalAttachments, setLocalAttachments, showError, toAttachmentRows]
  );

  return {
    files,
    filesLoading,
    filesError,
    fileBusy,
    uploadQueue,
    thumbUrl,
    previewBusy,
    onUpload,
    onDropFiles,
    openAttachment,
    onDeleteFile,
  };
}

export type UseCourseRecordAttachmentsReturn = ReturnType<typeof useCourseRecordAttachments>;
