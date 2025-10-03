import styled from 'styled-components';
import { LoadingSpinner } from '@/components/common/Loading';
import type { TrendPoint } from '@/lib/trend';

type SparklineChartProps = {
  points: TrendPoint[];
  color: string;
  loading: boolean;
  height?: number;
  unitLabel?: string;
};

type ColumnChartProps = {
  points: TrendPoint[];
  color: string;
  loading: boolean;
  maxTicks?: number;
};

export function SparklineChart({ points, color, loading, height = 120, unitLabel }: SparklineChartProps) {
  if (loading) {
    return (
      <ChartLoading>
        <LoadingSpinner />
        <span>데이터를 불러오는 중…</span>
      </ChartLoading>
    );
  }

  if (points.length === 0) {
    return <ChartEmpty>표시할 데이터가 없습니다.</ChartEmpty>;
  }

  const values = points.map((point) => point.value);
  const pathD = buildSparklinePath(values, 240, height);
  const polylinePoints = buildPolylinePoints(values, 240, height);
  const gradientId = `spark-${color.replace('#', '')}`;

  return (
    <SparklineWrapper>
      <svg viewBox={`0 0 240 ${height}`} role="img" aria-label="변화 추이 그래프">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={pathD} fill={`url(#${gradientId})`} stroke="none" />
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <SparklineTicks>
        {points.map((point, index) => (
          <span key={point.key || index} aria-hidden>
            {index % Math.ceil(points.length / 6 || 1) === 0 ? point.label : ''}
          </span>
        ))}
      </SparklineTicks>
      {unitLabel ? <SparklineNote>{unitLabel} 단위</SparklineNote> : null}
    </SparklineWrapper>
  );
}

export function ColumnChart({ points, color, loading, maxTicks = 6 }: ColumnChartProps) {
  if (loading) {
    return (
      <ChartLoading>
        <LoadingSpinner />
        <span>데이터를 불러오는 중…</span>
      </ChartLoading>
    );
  }

  if (points.length === 0) {
    return <ChartEmpty>표시할 데이터가 없습니다.</ChartEmpty>;
  }

  const values = points.map((point) => point.value);
  const max = Math.max(...values, 1);
  const tickInterval = Math.max(1, Math.ceil(points.length / maxTicks));

  return (
    <BarsWrapper>
      {points.map((point, index) => (
        <div key={point.key || index} className="bar-item">
          <div
            className="bar"
            style={{
              height: `${(point.value / max) * 100 || 2}%`,
              background: `linear-gradient(180deg, ${color} 0%, ${color}33 100%)`,
            }}
          />
          <span className="tick" aria-hidden>
            {index % tickInterval === 0 ? point.label : ''}
          </span>
        </div>
      ))}
    </BarsWrapper>
  );
}

const SparklineWrapper = styled.div`
  display: grid;
  gap: 6px;
  svg {
    width: 100%;
    height: auto;
  }
`;

const SparklineTicks = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
`;

const SparklineNote = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;

const BarsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  align-items: end;
  gap: 6px;
  height: 120px;
  .bar-item {
    display: grid;
    gap: 4px;
    justify-items: center;
  }
  .bar {
    width: 100%;
    border-radius: 6px 6px 0 0;
    min-height: 2px;
  }
  .tick {
    font-size: 10px;
    color: #94a3b8;
  }
`;

const ChartLoading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 13px;
`;

const ChartEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 13px;
`;

function buildSparklinePath(values: number[], width: number, height: number) {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  const topLine = values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const bottomLine = `${width.toFixed(2)},${height.toFixed(2)} 0,${height.toFixed(2)}`;
  return `M ${topLine} L ${bottomLine} Z`;
}

function buildPolylinePoints(values: number[], width: number, height: number) {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}
