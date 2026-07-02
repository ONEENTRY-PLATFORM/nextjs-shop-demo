'use client';

import type { JSX } from 'react';

import {
  type Bucket,
  bucketColor,
  bucketFor,
  bucketLabel,
  formatMs,
  type RequestResult,
} from './statsUtils';

const CHART_HEIGHT = 220;
const CHART_PAD_X = 36;
const CHART_PAD_Y = 16;

/**
 * BarChart — request-order latency bars (one rect per sample).
 *
 * Computes the y-scale once from the max finite latency in `results`, then renders a
 * rect per sample. Bars are colored by `bucketFor()` so visual outliers and failures
 * stand out without a separate axis label. Y-axis shows the scale max + grid labels.
 * @param   {object}          props         - Component props.
 * @param   {RequestResult[]} props.results - Per-request samples (already in chronological order).
 * @returns {JSX.Element}                   JSX `<svg>` of the bar chart.
 */
export const BarChart = ({
  results,
}: {
  results: RequestResult[];
}): JSX.Element => {
  const finite = results.filter(
    (r) => r.success && Number.isFinite(r.time) && r.time >= 0,
  );
  const yMax = finite.length ? Math.max(...finite.map((r) => r.time)) : 100;
  const yScale = yMax > 0 ? yMax : 1;
  const innerH = CHART_HEIGHT - CHART_PAD_Y * 2;
  const barCount = Math.max(results.length, 1);
  const viewW = 1000;
  const innerW = viewW - CHART_PAD_X * 2;
  const barW = innerW / barCount;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${viewW} ${CHART_HEIGHT}`}
      preserveAspectRatio="none"
      className="block h-55 w-full"
      role="img"
      aria-label="Per-request latency bar chart"
    >
      {gridLines.map((g) => {
        const y = CHART_PAD_Y + innerH * (1 - g);
        const v = yScale * g;
        return (
          <g key={g}>
            <line
              x1={CHART_PAD_X}
              x2={viewW - CHART_PAD_X / 2}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <text
              x={CHART_PAD_X - 6}
              y={y + 4}
              textAnchor="end"
              fontSize={11}
              fill="rgba(223,233,249,0.6)"
            >
              {v.toFixed(0)}
            </text>
          </g>
        );
      })}
      {results.map((r, i) => {
        const bucket: Bucket = bucketFor(r.time, r.success);
        const h =
          r.success && r.time > 0 ? Math.max(2, (r.time / yScale) * innerH) : 6;
        const x = CHART_PAD_X + i * barW + Math.min(2, barW * 0.1);
        const y = CHART_PAD_Y + innerH - h;
        const w = Math.max(1, barW - Math.min(2, barW * 0.1) * 2);
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill={bucketColor[bucket]}
            opacity={r.success ? 0.9 : 0.5}
          >
            <title>
              {`#${r.index + 1} — ${r.success ? formatMs(r.time) : `failed: ${r.error ?? 'unknown'}`}`}
            </title>
          </rect>
        );
      })}
      <line
        x1={CHART_PAD_X}
        x2={viewW - CHART_PAD_X / 2}
        y1={CHART_HEIGHT - CHART_PAD_Y}
        y2={CHART_HEIGHT - CHART_PAD_Y}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
    </svg>
  );
};

const HIST_HEIGHT = 200;
const HIST_PAD_X = 36;
const HIST_PAD_Y = 16;
const HIST_BIN_COUNT = 16;

/**
 * Histogram — latency distribution over `HIST_BIN_COUNT` equal-width bins.
 *
 * Builds bins from `0..max(latency)`, fills them by sample count, then renders each
 * bin as a green rectangle. Bin index is shown on the x-axis as a latency range label
 * (start..end ms). Counts are shown on the y-axis.
 * @param   {object}          props         - Component props.
 * @param   {RequestResult[]} props.results - Successful + failed samples; only successful contribute to bins.
 * @returns {JSX.Element}                   JSX `<svg>` of the histogram.
 */
export const Histogram = ({
  results,
}: {
  results: RequestResult[];
}): JSX.Element => {
  const times = results
    .filter((r) => r.success && Number.isFinite(r.time) && r.time >= 0)
    .map((r) => r.time);
  const max = times.length ? Math.max(...times) : 1;
  const bins = new Array<number>(HIST_BIN_COUNT).fill(0);
  for (const t of times) {
    const idx = Math.min(
      HIST_BIN_COUNT - 1,
      Math.floor((t / max) * HIST_BIN_COUNT),
    );
    bins[idx] = (bins[idx] ?? 0) + 1;
  }
  const yMax = Math.max(1, ...bins);
  const viewW = 1000;
  const innerW = viewW - HIST_PAD_X * 2;
  const innerH = HIST_HEIGHT - HIST_PAD_Y * 2;
  const binW = innerW / HIST_BIN_COUNT;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${HIST_HEIGHT}`}
      preserveAspectRatio="none"
      className="block h-50 w-full"
      role="img"
      aria-label="Latency histogram"
    >
      {[0, 0.5, 1].map((g) => {
        const y = HIST_PAD_Y + innerH * (1 - g);
        return (
          <g key={g}>
            <line
              x1={HIST_PAD_X}
              x2={viewW - HIST_PAD_X / 2}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <text
              x={HIST_PAD_X - 6}
              y={y + 4}
              textAnchor="end"
              fontSize={11}
              fill="rgba(223,233,249,0.6)"
            >
              {(yMax * g).toFixed(0)}
            </text>
          </g>
        );
      })}
      {bins.map((count, i) => {
        const h = (count / yMax) * innerH;
        const x = HIST_PAD_X + i * binW + 2;
        const y = HIST_PAD_Y + innerH - h;
        const w = Math.max(1, binW - 4);
        const binStart = (i / HIST_BIN_COUNT) * max;
        const binEnd = ((i + 1) / HIST_BIN_COUNT) * max;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#22c55e"
            opacity={0.85}
          >
            <title>{`${binStart.toFixed(0)}–${binEnd.toFixed(0)} ms — ${count} req`}</title>
          </rect>
        );
      })}
      <line
        x1={HIST_PAD_X}
        x2={viewW - HIST_PAD_X / 2}
        y1={HIST_HEIGHT - HIST_PAD_Y}
        y2={HIST_HEIGHT - HIST_PAD_Y}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
    </svg>
  );
};

/**
 * Legend — color/label key for the latency buckets used by `BarChart`.
 * @returns {JSX.Element} JSX inline legend (color swatch + label per bucket).
 */
export const Legend = (): JSX.Element => {
  const buckets: Bucket[] = [
    'fast',
    'ok',
    'medium',
    'slow',
    'verySlow',
    'failed',
  ];
  return (
    <ul className="text-paper/70 flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {buckets.map((b) => (
        <li key={b} className="flex items-center gap-2">
          <span
            className="inline-block size-3 rounded-sm"
            style={{ backgroundColor: bucketColor[b] }}
          />
          {bucketLabel[b]}
        </li>
      ))}
    </ul>
  );
};
