import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Simple enter animation on route change
const enter = keyframes`
  0% { opacity: 0; transform: translateY(6px) scale(0.995); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const Animated = styled.div`
  animation: ${enter} 200ms ease-out;
`;

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Key by pathname so each navigation triggers a fresh enter animation
  const key = useMemo(() => location.pathname + location.search, [location.pathname, location.search]);
  return <Animated key={key}>{children}</Animated>;
}

// Top fixed progress bar that animates during route changes
const BarWrap = styled.div`
  position: fixed; left: 0; top: 0; right: 0; height: 3px; z-index: 1100; pointer-events: none;
`;
const Bar = styled.div<{ $width: number; $visible: boolean }>`
  height: 100%;
  width: ${({ $width }) => `${$width}%`};
  background: linear-gradient(90deg, #6366f1, #22d3ee);
  box-shadow: 0 1px 6px rgba(99,102,241,.35);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: width 200ms ease-out, opacity 260ms ease-in;
`;

export function TopProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // start on path change
    setVisible(true);
    setWidth(10);
    // simulate progressing to 85%
    const steps = [35, 55, 70, 85];
    let i = 0;
    function tick() {
      setWidth((w) => Math.max(w, steps[i]));
      i += 1;
      if (i < steps.length) timer.current = window.setTimeout(tick, 140);
    }
    timer.current = window.setTimeout(tick, 120);
    // finish shortly after mount
    const finish = window.setTimeout(() => {
      setWidth(100);
      // fade out after reaching 100
      const hide = window.setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 250);
      return () => window.clearTimeout(hide);
    }, 600);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      window.clearTimeout(finish);
    };
  }, [location.pathname, location.search]);

  return (
    <BarWrap aria-hidden>
      <Bar $width={width} $visible={visible} />
    </BarWrap>
  );
}

