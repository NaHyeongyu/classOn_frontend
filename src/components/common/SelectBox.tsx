import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

export type SelectOption = { label: string; value: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
};

export default function SelectBox({ value, onChange, options, placeholder, disabled, ariaLabel, className, style, width }: Props) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number>(-1);
  const ref = useRef<HTMLDivElement | null>(null);

  const label = useMemo(() => {
    const f = options.find(o => o.value === value);
    return f?.label ?? '';
  }, [options, value]);

  const toggle = useCallback(() => { if (!disabled) setOpen(o => !o); }, [disabled]);
  const close = useCallback(() => setOpen(false), []);
  const select = useCallback((idx: number) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  }, [options, onChange]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setHover(h => Math.min(options.length - 1, Math.max(0, h + 1))); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHover(h => Math.max(0, (h < 0 ? options.length - 1 : h - 1))); }
      if (e.key === 'Enter') { e.preventDefault(); select(hover >= 0 ? hover : Math.max(0, options.findIndex(o => o.value === value))); }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, hover, options, value, select]);

  useEffect(() => {
    if (!open) setHover(-1);
  }, [open]);

  const widthStyle = useMemo(() => (width != null ? { width: typeof width === 'number' ? `${width}px` : width } : {}), [width]);

  return (
    <Wrap ref={ref} className={className} style={{ ...style, ...widthStyle }} aria-label={ariaLabel} data-disabled={disabled || undefined}>
      <Control type="button" onClick={toggle} disabled={disabled} data-open={open || undefined}>
        <span className={(!value && placeholder) ? 'placeholder' : undefined}>
          {(!value && placeholder) ? placeholder : (label || value || '')}
        </span>
        <Chevron aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </Chevron>
      </Control>
      {open && (
        <Menu role="listbox">
          {options.map((o, i) => (
            <MenuItem key={o.value}
              role="option"
              aria-selected={o.value === value}
              data-active={i === hover || undefined}
              data-selected={o.value === value || undefined}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              onClick={() => select(i)}>
              {o.label}
            </MenuItem>
          ))}
          {options.length === 0 && <Empty>옵션이 없습니다.</Empty>}
        </Menu>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  width: 100%;
  min-width: 80px;
`;
const Control = styled.button`
  width: 100%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px 0 12px;
  background: #fff;
  color: #0f172a;
  font-size: 14px;
  cursor: pointer;
  .placeholder { color:#9ca3af; }
  &[data-open='true'] { border-color:#111827; box-shadow: 0 0 0 3px rgba(17,24,39,0.08); }
  &:disabled{ cursor: not-allowed; opacity: .6; }
`;
const Chevron = styled.span`
  display: inline-flex; color:#9ca3af;
`;
const Menu = styled.div`
  position: absolute; inset: auto 0 0 0; transform: translateY(calc(100% + 4px));
  max-height: 220px; overflow: auto; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  z-index: 40; padding: 4px;
`;
const MenuItem = styled.div`
  height: 36px; display: flex; align-items: center; padding: 0 10px; border-radius: 8px; font-size: 14px; color:#111827; cursor: pointer;
  &[data-active='true']{ background:#f3f4f6; }
  &[data-selected='true']{ background:#eef2ff; color:#1f2937; font-weight: 700; }
`;
const Empty = styled.div`
  padding: 8px 10px; color:#6b7280; font-size: 13px;
`;

