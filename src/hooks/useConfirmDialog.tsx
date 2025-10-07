import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";

type ConfirmConfig = {
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  hideCancel?: boolean;
};

type PendingState = {
  resolve: (result: boolean) => void;
  options: ConfirmConfig;
};

export function useConfirmDialog(defaultOptions?: ConfirmConfig) {
  const [pending, setPending] = useState<PendingState | null>(null);

  const confirm = useCallback(
    (options: ConfirmConfig) =>
      new Promise<boolean>((resolve) => {
        setPending((current) => {
          current?.resolve(false);
          return {
            resolve,
            options: {
              ...defaultOptions,
              ...options,
            },
          };
        });
      }),
    [defaultOptions],
  );

  const close = useCallback((result: boolean) => {
    setPending((current) => {
      if (current) {
        current.resolve(result);
      }
      return null;
    });
  }, []);

  const dialog = useMemo(
    () => (
      <ConfirmDialog
        open={pending != null}
        title={pending?.options.title ?? defaultOptions?.title ?? "확인"}
        message={pending?.options.message ?? defaultOptions?.message}
        confirmLabel={pending?.options.confirmLabel ?? defaultOptions?.confirmLabel ?? "확인"}
        cancelLabel={pending?.options.cancelLabel ?? defaultOptions?.cancelLabel ?? "취소"}
        tone={pending?.options.tone ?? defaultOptions?.tone ?? "default"}
        hideCancel={pending?.options.hideCancel ?? defaultOptions?.hideCancel}
        onCancel={() => close(false)}
        onConfirm={() => close(true)}
      />
    ),
    [close, defaultOptions, pending],
  );

  return { confirm, dialog };
}

