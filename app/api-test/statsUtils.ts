/**
 * Stats — aggregate metrics derived from an array of latency samples.
 * @property {number} count  - Total successful samples.
 * @property {number} min    - Smallest sample (ms).
 * @property {number} max    - Largest sample (ms).
 * @property {number} mean   - Arithmetic mean (ms).
 * @property {number} median - 50th percentile (ms).
 * @property {number} p95    - 95th percentile (ms).
 * @property {number} p99    - 99th percentile (ms).
 * @property {number} std    - Population standard deviation (ms).
 */
export type Stats = {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  p95: number;
  p99: number;
  std: number;
};

/**
 * computeStats — derives summary metrics (min/mean/median/p95/p99/max/std) from raw latencies.
 *
 * Sorts a copy of the input once, then reads order-statistics from the sorted view.
 * Percentiles use the nearest-rank method (floor((p/100) * n), clamped to n-1).
 * @param   {number[]}     times - Latency samples in milliseconds.
 * @returns {Stats | null}       Aggregate `Stats` or `null` when the input is empty.
 */
export const computeStats = (times: number[]): Stats | null => {
  if (!times.length) return null;
  const sorted = [...times].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0]!;
  const max = sorted[n - 1]!;
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;
  const percentile = (p: number): number =>
    sorted[Math.min(n - 1, Math.max(0, Math.floor((p / 100) * n)))]!;
  const variance = sorted.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  return {
    count: n,
    min,
    max,
    mean,
    median: percentile(50),
    p95: percentile(95),
    p99: percentile(99),
    std: Math.sqrt(variance),
  };
};

/**
 * Bucket — qualitative latency band used for chart coloring.
 */
export type Bucket = 'fast' | 'ok' | 'medium' | 'slow' | 'verySlow' | 'failed';

/**
 * bucketColor — Tailwind-compatible fill color for each latency bucket.
 */
export const bucketColor: Record<Bucket, string> = {
  fast: '#22c55e',
  ok: '#84cc16',
  medium: '#eab308',
  slow: '#f59e0b',
  verySlow: '#ef4444',
  failed: '#6b7280',
};

/**
 * bucketLabel — human-readable label for each latency band, used in the legend.
 */
export const bucketLabel: Record<Bucket, string> = {
  fast: '< 50 ms',
  ok: '50–200 ms',
  medium: '200–500 ms',
  slow: '500–1000 ms',
  verySlow: '> 1000 ms',
  failed: 'failed',
};

/**
 * bucketFor — classifies a single sample into a `Bucket`.
 *
 * Failures (negative or non-finite times) collapse to `failed`. Successful samples
 * map onto five fixed bands aligned with `bucketLabel`.
 * @param   {number}  time    - Sample latency in ms (negative when the request failed).
 * @param   {boolean} success - Whether the request succeeded.
 * @returns {Bucket}          Latency bucket.
 */
export const bucketFor = (time: number, success: boolean): Bucket => {
  if (!success || !Number.isFinite(time) || time < 0) return 'failed';
  if (time < 50) return 'fast';
  if (time < 200) return 'ok';
  if (time < 500) return 'medium';
  if (time < 1000) return 'slow';
  return 'verySlow';
};

/**
 * formatMs — pretty-prints a millisecond value with two decimals and a unit suffix.
 * @param   {number} v - Value in ms.
 * @returns {string}   Formatted string like `"123.45 ms"`; `"—"` when the input is non-finite.
 */
export const formatMs = (v: number): string =>
  Number.isFinite(v) ? `${v.toFixed(2)} ms` : '—';

/**
 * formatBytes — pretty-prints a byte count using KB / MB units when appropriate.
 * @param   {number} v - Byte count.
 * @returns {string}   Formatted string with the largest unit that keeps the number ≥ 1.
 */
export const formatBytes = (v: number): string => {
  if (!Number.isFinite(v) || v <= 0) return '0 B';
  if (v < 1024) return `${v} B`;
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(1)} KB`;
  return `${(v / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * RequestResult — a single benchmark sample collected by the dashboard.
 * @property {number}  index        - 0-based ordering within the run.
 * @property {number}  time         - Client-observed total round-trip in ms (-1 on failure).
 * @property {number}  [serverTime] - Server-side response time reported by the route.
 * @property {boolean} success      - Whether the request returned `success: true`.
 * @property {number}  [size]       - Approximate response body size in bytes.
 * @property {string}  [error]      - Failure message, if any.
 * @property {number}  startedAt    - Epoch ms when the request was kicked off.
 */
export type RequestResult = {
  index: number;
  time: number;
  serverTime?: number;
  success: boolean;
  size?: number;
  error?: string;
  startedAt: number;
};

/**
 * RunSummary — completed (or interrupted) benchmark run, persisted in the history pane.
 * @property {string}                    id           - Local-only unique id.
 * @property {string}                    preset       - Preset that was tested.
 * @property {string}                    marker       - Marker used by the preset (empty for `products`).
 * @property {boolean}                   cached       - Whether the cached server fetcher was used.
 * @property {('sequential'|'parallel')} mode         - Execution mode.
 * @property {number}                    concurrency  - Effective concurrency level (1 for sequential).
 * @property {number}                    count        - Total requests requested.
 * @property {RequestResult[]}           results      - Individual samples.
 * @property {number}                    startedAt    - Epoch ms when the run began.
 * @property {number}                    [finishedAt] - Epoch ms when the run finished or was aborted.
 * @property {boolean}                   [aborted]    - True when the run was stopped before completion.
 */
export type RunSummary = {
  id: string;
  preset: string;
  marker: string;
  cached: boolean;
  mode: 'sequential' | 'parallel';
  concurrency: number;
  count: number;
  results: RequestResult[];
  startedAt: number;
  finishedAt?: number;
  aborted?: boolean;
};
