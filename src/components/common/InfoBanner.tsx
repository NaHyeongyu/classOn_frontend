import styled from "styled-components";
import type { ReactNode } from "react";

interface InfoBannerProps {
  title?: string;
  description?: ReactNode;
  tips?: ReactNode[];
  onClose?: () => void;
  className?: string;
}

export function InfoBanner({ title, description, tips, onClose, className }: InfoBannerProps) {
  return (
    <Wrap className={className} role="note">
      <Body>
        {title ? <h4>{title}</h4> : null}
        {description ? <p>{description}</p> : null}
        {tips && tips.length ? (
          <ul>
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        ) : null}
      </Body>
      {onClose ? (
        <Close type="button" onClick={onClose} aria-label="도움말 닫기">
          ×
        </Close>
      ) : null}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid rgba(96, 165, 250, 0.28);
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.38), rgba(255, 255, 255, 0.9));
  color: #0f172a;
`;

const Body = styled.div`
  display: grid;
  gap: 6px;
  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #1d4ed8;
  }
  p {
    margin: 0;
    font-size: 13px;
    color: #475569;
  }
  ul {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 4px;
    font-size: 12.5px;
    color: #475569;
  }
`;

const Close = styled.button`
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 18px;
  padding: 0 4px;
  cursor: pointer;
  align-self: start;
  &:hover {
    color: #1d4ed8;
  }
`;

export default InfoBanner;
