'use client';

import {
  type JSX,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MENUS, PAGES } from '@/app/utils/constants';

import { BarChart, Histogram, Legend } from './charts';
import {
  bucketColor,
  bucketFor,
  bucketLabel,
  computeStats,
  formatBytes,
  formatMs,
  type RequestResult,
  type RunSummary,
} from './statsUtils';

type TableSort = 'order' | 'slowest' | 'fastest';
type TableFilter = 'all' | 'ok' | 'failed';

type Preset = 'page' | 'menu' | 'block' | 'products';
type Mode = 'sequential' | 'parallel';

const PRESET_OPTIONS: ReadonlyArray<{
  value: Preset;
  label: string;
  defaultMarker: string;
  hint: string;
}> = [
  {
    value: 'page',
    label: 'Page',
    defaultMarker: PAGES.home,
    hint: 'Pages.getPageByUrl',
  },
  {
    value: 'menu',
    label: 'Menu',
    defaultMarker: MENUS.mainWeb,
    hint: 'Menus.getMenusByMarker',
  },
  {
    value: 'block',
    label: 'Block',
    defaultMarker: '',
    hint: 'Blocks.getBlockByMarker (marker required)',
  },
  {
    value: 'products',
    label: 'Products',
    defaultMarker: '',
    hint: 'Products.getProducts ([], lang, {0,12})',
  },
];

const COUNT_OPTIONS = [5, 10, 20, 50, 100, 200] as const;

type ProbeResponse = {
  success: boolean;
  responseTime?: number;
  size?: number;
  error?: string;
};

/**
 * runProbe — fires one benchmark request against the test-connection route.
 *
 * Times the call client-side, merges the server-reported `responseTime` (when present)
 * onto the result, and translates aborts / network failures into a non-throwing
 * `RequestResult` with `success: false` so the caller can keep iterating.
 * @param   {object}                 opts        - Request parameters.
 * @param   {number}                 opts.index  - 0-based ordering within the run.
 * @param   {Preset}                 opts.preset - Active preset.
 * @param   {string}                 opts.marker - Marker / pageUrl (may be empty for `products`).
 * @param   {boolean}                opts.cached - Whether to ask the route to use the cached server fetcher.
 * @param   {AbortSignal}            opts.signal - Signal used by the dashboard's Stop button.
 * @returns {Promise<RequestResult>}             Promise resolving to a `RequestResult` (always — failures don't throw).
 */
const runProbe = async (opts: {
  index: number;
  preset: Preset;
  marker: string;
  cached: boolean;
  signal: AbortSignal;
}): Promise<RequestResult> => {
  const startedAt = Date.now();
  const t0 = performance.now();
  const url = `/api/test-connection?preset=${opts.preset}&marker=${encodeURIComponent(
    opts.marker,
  )}&cached=${opts.cached ? '1' : '0'}`;
  try {
    const res = await fetch(url, { signal: opts.signal, cache: 'no-store' });
    const body = (await res.json()) as ProbeResponse;
    const t1 = performance.now();
    const result: RequestResult = {
      index: opts.index,
      time: t1 - t0,
      success: !!body.success,
      startedAt,
    };
    if (typeof body.responseTime === 'number')
      result.serverTime = body.responseTime;
    if (typeof body.size === 'number') result.size = body.size;
    if (typeof body.error === 'string') result.error = body.error;
    return result;
  } catch (e) {
    const t1 = performance.now();
    const message = e instanceof Error ? e.message : 'request failed';
    return {
      index: opts.index,
      time: t1 - t0,
      success: false,
      error: message,
      startedAt,
    };
  }
};

/**
 * Stat — single metric pill in the summary grid.
 *
 * Renders the label + value as a small card. When `tooltip` is provided, the card
 * becomes a `group` and an absolutely-positioned popover appears on hover or focus,
 * explaining what the metric means. `tabIndex={0}` keeps the tooltip reachable from
 * the keyboard.
 * @param   {object}      props           - Component props.
 * @param   {string}      props.label     - Metric name (uppercased above the value).
 * @param   {string}      props.value     - Formatted metric value.
 * @param   {string}      [props.tone]    - Optional accent tone applied to the value text.
 * @param   {string}      [props.tooltip] - Plain-text explanation shown on hover/focus.
 * @returns {JSX.Element}                 JSX pill with label + value (+ optional hover tooltip).
 */
const Stat = ({
  label,
  value,
  tone,
  tooltip,
}: {
  label: string;
  value: string;
  tone?: string;
  tooltip?: string;
}): JSX.Element => (
  <div
    className="group rounded-card border-paper/10 focus-visible:border-paper/40 relative border bg-white/5 px-3 py-2 outline-none"
    tabIndex={tooltip ? 0 : -1}
  >
    <div className="tracking-fine text-paper/50 text-[10px] uppercase">
      {label}
    </div>
    <div
      className={`mt-0.5 font-semibold tabular-nums ${tone ?? 'text-paper'}`}
    >
      {value}
    </div>
    {tooltip && (
      <div
        role="tooltip"
        className="rounded-card border-paper/15 text-paper/90 pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 border bg-black/95 px-3 py-2 text-[11px] leading-snug font-normal tracking-normal opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {tooltip}
      </div>
    )}
  </div>
);

/**
 * Th — table header cell with an optional hover/focus tooltip.
 *
 * Wraps the cell content in a `group` span and renders a popover *below* the header
 * (the table sits low in the page, so `top-full` keeps the tooltip on-screen). When
 * `tooltip` is provided the cell text gets a dotted underline + `cursor-help` to
 * signal interactivity. `tabIndex={0}` keeps the tooltip reachable from the keyboard.
 * @param   {object}           props           - Component props.
 * @param   {ReactNode}        props.children  - Header label content.
 * @param   {('left'|'right')} [props.align]   - Text alignment inside the `<th>` (default left).
 * @param   {string}           [props.tooltip] - Plain-text explanation shown on hover/focus.
 * @returns {JSX.Element}                      JSX `<th>` cell.
 */
const Th = ({
  children,
  align,
  tooltip,
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  tooltip?: string;
}): JSX.Element => (
  <th
    className={`px-2 py-1 font-normal ${align === 'right' ? 'text-right' : ''}`}
  >
    {tooltip ? (
      <span
        className="group decoration-paper/30 focus-visible:decoration-paper/70 relative inline-flex cursor-help items-center gap-1 underline decoration-dotted underline-offset-2 outline-none"
        tabIndex={0}
      >
        {children}
        <span
          role="tooltip"
          className={`rounded-card border-paper/15 text-paper/90 pointer-events-none invisible absolute top-full z-20 mt-2 w-56 border bg-black/95 px-3 py-2 text-[11px] leading-snug font-normal tracking-normal normal-case opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {tooltip}
        </span>
      </span>
    ) : (
      children
    )}
  </th>
);

/**
 * ApiTestClient — dev-only OneEntry API benchmark dashboard.
 *
 * Lets the developer pick a preset (Pages / Menus / Blocks / Products), toggle the
 * cached server fetcher vs raw SDK call, choose sequential vs parallel execution,
 * and stream measurements into a live bar chart + histogram + metric grid. Runs
 * accumulate into an in-memory history pane for quick before/after comparison.
 * Sequential mode awaits each probe in turn; parallel mode runs a worker pool of
 * `concurrency` async loops. Stop is honoured via `AbortController`.
 * @returns {JSX.Element} JSX of the benchmark dashboard.
 */
export default function ApiTestClient(): JSX.Element {
  const [preset, setPreset] = useState<Preset>('page');
  const [marker, setMarker] = useState<string>(PAGES.home);
  const [cached, setCached] = useState<boolean>(false);
  const [count, setCount] = useState<number>(20);
  const [mode, setMode] = useState<Mode>('sequential');
  const [concurrency, setConcurrency] = useState<number>(4);
  const [running, setRunning] = useState<boolean>(false);
  const [results, setResults] = useState<RequestResult[]>([]);
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [tableSort, setTableSort] = useState<TableSort>('order');
  const [tableFilter, setTableFilter] = useState<TableFilter>('all');
  const abortRef = useRef<AbortController | null>(null);

  const selectPreset = useCallback((p: Preset) => {
    setPreset(p);
    const opt = PRESET_OPTIONS.find((o) => o.value === p);
    setMarker(opt?.defaultMarker ?? '');
  }, []);

  const startRun = useCallback(async (): Promise<void> => {
    if (running) return;
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setRunning(true);
    setResults([]);
    const startedAt = Date.now();
    const effectiveConcurrency =
      mode === 'parallel' ? Math.max(1, Math.min(concurrency, count)) : 1;

    const collected: RequestResult[] = [];
    let nextIndex = 0;

    /**
     * dispatchNext — pulls the next index from a shared counter and probes it.
     *
     * Used by both sequential (one worker) and parallel (N workers) paths.
     * Streams each result both into the shared `collected` array (for the final
     * summary) and into React state (for the live UI).
     * @returns {Promise<boolean>} `false` when the run is exhausted or aborted; `true` after a probe.
     */
    const dispatchNext = async (): Promise<boolean> => {
      if (ctrl.signal.aborted) return false;
      const i = nextIndex++;
      if (i >= count) return false;
      const r = await runProbe({
        index: i,
        preset,
        marker,
        cached,
        signal: ctrl.signal,
      });
      collected.push(r);
      setResults((prev) => [...prev, r]);
      return true;
    };

    const worker = async (): Promise<void> => {
      while (await dispatchNext()) {
        // loop drains until exhausted or aborted
      }
    };

    const workers = Array.from({ length: effectiveConcurrency }, worker);
    await Promise.all(workers);

    const summary: RunSummary = {
      id: `run-${startedAt}-${Math.random().toString(36).slice(2, 7)}`,
      preset,
      marker,
      cached,
      mode,
      concurrency: effectiveConcurrency,
      count,
      results: collected.slice().sort((a, b) => a.index - b.index),
      startedAt,
      finishedAt: Date.now(),
      aborted: ctrl.signal.aborted,
    };
    setRuns((prev) => [summary, ...prev].slice(0, 10));
    setRunning(false);
    abortRef.current = null;
  }, [running, mode, concurrency, count, preset, marker, cached]);

  const stopRun = useCallback((): void => {
    abortRef.current?.abort();
  }, []);

  const orderedResults = useMemo(
    () => [...results].sort((a, b) => a.index - b.index),
    [results],
  );

  const successResults = useMemo(
    () => orderedResults.filter((r) => r.success),
    [orderedResults],
  );
  const stats = useMemo(
    () => computeStats(successResults.map((r) => r.time)),
    [successResults],
  );
  const serverStats = useMemo(
    () =>
      computeStats(
        successResults
          .map((r) => r.serverTime)
          .filter((v): v is number => typeof v === 'number'),
      ),
    [successResults],
  );
  const failed = orderedResults.length - successResults.length;
  const totalBytes = useMemo(
    () => successResults.reduce((acc, r) => acc + (r.size ?? 0), 0),
    [successResults],
  );
  const progress =
    count > 0 ? Math.min(100, (orderedResults.length / count) * 100) : 0;

  const tableRows = useMemo(() => {
    let rows = orderedResults.slice();
    if (tableFilter === 'ok') rows = rows.filter((r) => r.success);
    else if (tableFilter === 'failed') rows = rows.filter((r) => !r.success);
    if (tableSort === 'slowest') {
      rows.sort((a, b) => {
        if (a.success !== b.success) return a.success ? 1 : -1;
        return b.time - a.time;
      });
    } else if (tableSort === 'fastest') {
      rows.sort((a, b) => {
        if (a.success !== b.success) return a.success ? -1 : 1;
        return a.time - b.time;
      });
    }
    return rows;
  }, [orderedResults, tableFilter, tableSort]);

  const exportJson = useCallback((): void => {
    const payload = {
      exportedAt: new Date().toISOString(),
      current: {
        preset,
        marker,
        cached,
        mode,
        concurrency: mode === 'parallel' ? concurrency : 1,
        count,
        results: orderedResults,
        stats,
      },
      history: runs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oneentry-api-benchmark-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [
    preset,
    marker,
    cached,
    mode,
    concurrency,
    count,
    orderedResults,
    stats,
    runs,
  ]);

  return (
    <div className="text-paper mx-auto max-w-323 px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">OneEntry API Benchmark</h1>
        <p className="text-paper/60 mt-1 text-sm">
          Dev dashboard for probing OneEntry endpoints.
        </p>
      </header>

      <section className="rounded-panel border-paper/10 grid gap-4 border bg-white/5 p-4 md:grid-cols-2">
        <div>
          <div className="tracking-fine text-paper/50 text-xs uppercase">
            Preset
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESET_OPTIONS.map((opt) => {
              const active = preset === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectPreset(opt.value)}
                  className={`rounded-card border px-3 py-1.5 text-sm transition ${
                    active
                      ? 'border-brand bg-brand text-white'
                      : 'border-paper/15 text-paper hover:border-paper/40 bg-transparent'
                  }`}
                  disabled={running}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-paper/50 mt-2 text-xs">
            {PRESET_OPTIONS.find((o) => o.value === preset)?.hint}
          </p>
        </div>

        <div>
          <label
            className="tracking-fine text-paper/50 text-xs uppercase"
            htmlFor="marker"
          >
            Marker / pageUrl
          </label>
          <input
            id="marker"
            type="text"
            value={marker}
            onChange={(e) => setMarker(e.target.value)}
            disabled={running || preset === 'products'}
            placeholder={
              preset === 'products'
                ? '(not used for products)'
                : 'e.g. home_web'
            }
            className="rounded-card border-paper/15 placeholder:text-paper/30 focus:border-brand mt-2 w-full border bg-black/30 px-3 py-1.5 text-sm focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <div className="tracking-fine text-paper/50 text-xs uppercase">
            Cache mode
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setCached(false)}
              disabled={running}
              className={`rounded-card border px-3 py-1.5 text-sm ${
                !cached
                  ? 'border-brand bg-brand text-white'
                  : 'border-paper/15 text-paper'
              }`}
            >
              Raw SDK
            </button>
            <button
              type="button"
              onClick={() => setCached(true)}
              disabled={running}
              className={`rounded-card border px-3 py-1.5 text-sm ${
                cached
                  ? 'border-brand bg-brand text-white'
                  : 'border-paper/15 text-paper'
              }`}
            >
              Cached fetcher
            </button>
          </div>
          <p className="text-paper/50 mt-2 text-xs">
            Raw = direct <code className="text-paper/70">getApi()</code> call.
            Cached = project&apos;s{' '}
            <code className="text-paper/70">unstable_cache + cache()</code>{' '}
            wrapper.
          </p>
        </div>

        <div>
          <div className="tracking-fine text-paper/50 text-xs uppercase">
            Execution
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('sequential')}
              disabled={running}
              className={`rounded-card border px-3 py-1.5 text-sm ${
                mode === 'sequential'
                  ? 'border-brand bg-brand text-white'
                  : 'border-paper/15 text-paper'
              }`}
            >
              Sequential
            </button>
            <button
              type="button"
              onClick={() => setMode('parallel')}
              disabled={running}
              className={`rounded-card border px-3 py-1.5 text-sm ${
                mode === 'parallel'
                  ? 'border-brand bg-brand text-white'
                  : 'border-paper/15 text-paper'
              }`}
            >
              Parallel
            </button>
            {mode === 'parallel' && (
              <label className="text-paper/70 flex items-center gap-2 text-xs">
                Concurrency
                <input
                  type="number"
                  min={1}
                  max={32}
                  value={concurrency}
                  onChange={(e: { target: { value: string } }) =>
                    setConcurrency(
                      Math.max(1, Math.min(32, Number(e.target.value) || 1)),
                    )
                  }
                  disabled={running}
                  className="rounded-card border-paper/15 focus:border-brand w-16 border bg-black/30 px-2 py-1 text-sm tabular-nums focus:outline-none disabled:opacity-50"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 md:col-span-2">
          <div>
            <div className="tracking-fine text-paper/50 text-xs uppercase">
              Requests
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  disabled={running}
                  className={`rounded-card border px-3 py-1.5 text-sm tabular-nums ${
                    count === n
                      ? 'border-brand bg-brand text-white'
                      : 'border-paper/15 text-paper'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {running ? (
              <button
                type="button"
                onClick={stopRun}
                className="rounded-card border border-red-500/50 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/30"
              >
                Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={startRun}
                className="rounded-card border-brand bg-brand hover:bg-brand-hover border px-4 py-2 text-sm font-semibold text-white"
              >
                Run benchmark
              </button>
            )}
            <button
              type="button"
              onClick={exportJson}
              disabled={!orderedResults.length}
              className="rounded-card border-paper/15 text-paper hover:border-paper/40 border bg-transparent px-4 py-2 text-sm disabled:opacity-40"
            >
              Export JSON
            </button>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="text-paper/60 flex items-center justify-between text-xs">
          <span>
            {orderedResults.length} / {count} requests
            {running ? ' — running…' : ''}
          </span>
          <span className="tabular-nums">{progress.toFixed(0)}%</span>
        </div>
        <div className="bg-paper/10 mt-1 h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-brand h-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        <Stat
          label="OK"
          value={`${successResults.length}`}
          tone="text-emerald-300"
          tooltip="Number of successful requests (HTTP 200 with success:true in the body)."
        />
        <Stat
          label="Failed"
          value={`${failed}`}
          tone={failed ? 'text-red-300' : 'text-paper/70'}
          tooltip="Requests that errored out — network failure, abort, HTTP error, or success:false."
        />
        <Stat
          label="Min"
          value={stats ? formatMs(stats.min) : '—'}
          tooltip="Fastest successful request. Useful as the best-case lower bound."
        />
        <Stat
          label="Mean"
          value={stats ? formatMs(stats.mean) : '—'}
          tooltip="Arithmetic mean of all successful latencies. Sensitive to outliers — compare against the median."
        />
        <Stat
          label="Median"
          value={stats ? formatMs(stats.median) : '—'}
          tooltip="50th percentile: half of the requests are faster, half slower. More robust to outliers than the mean."
        />
        <Stat
          label="p95"
          value={stats ? formatMs(stats.p95) : '—'}
          tooltip="95th percentile: 95% of requests complete at or below this value. A common SLO target."
        />
        <Stat
          label="p99"
          value={stats ? formatMs(stats.p99) : '—'}
          tooltip="99th percentile — the distribution's tail. Shows how bad the slowest 1% of requests get."
        />
        <Stat
          label="Max"
          value={stats ? formatMs(stats.max) : '—'}
          tooltip="Slowest successful request — peak latency in this sample."
        />
        <Stat
          label="Std dev"
          value={stats ? formatMs(stats.std) : '—'}
          tooltip="Standard deviation. The larger it is, the more latencies are scattered around the mean (less stable)."
        />
        <Stat
          label="Server p95"
          value={serverStats ? formatMs(serverStats.p95) : '—'}
          tone="text-paper/70"
          tooltip="p95 of the server-reported responseTime (route handler only, no network RTT). Gap vs client p95 = network overhead + browser/JSON parse."
        />
        <Stat
          label="Payload"
          value={formatBytes(totalBytes)}
          tone="text-paper/70"
          tooltip="Total response body size across all successful requests (approximate — measured as the JSON string length in bytes)."
        />
      </section>

      <section className="rounded-panel border-paper/10 mt-6 border bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="tracking-fine text-paper/70 text-sm font-semibold uppercase">
            Latency per request
          </h2>
          <Legend />
        </div>
        <BarChart results={orderedResults} />
      </section>

      <section className="rounded-panel border-paper/10 mt-4 border bg-white/5 p-4">
        <h2 className="tracking-fine text-paper/70 mb-2 text-sm font-semibold uppercase">
          Distribution
        </h2>
        <Histogram results={orderedResults} />
      </section>

      {orderedResults.length > 0 && (
        <section className="rounded-panel border-paper/10 mt-4 border bg-white/5 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="tracking-fine text-paper/70 text-sm font-semibold uppercase">
              Per-request details
            </h2>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-paper/50">Sort:</span>
                {(['order', 'slowest', 'fastest'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTableSort(s)}
                    className={`rounded px-2 py-0.5 ${
                      tableSort === s
                        ? 'bg-brand text-white'
                        : 'bg-paper/10 text-paper/70 hover:bg-paper/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-paper/50">Filter:</span>
                {(['all', 'ok', 'failed'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTableFilter(f)}
                    className={`rounded px-2 py-0.5 ${
                      tableFilter === f
                        ? 'bg-brand text-white'
                        : 'bg-paper/10 text-paper/70 hover:bg-paper/20'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-xs tabular-nums">
              <thead>
                <tr className="tracking-fine text-paper/50 uppercase">
                  <Th
                    align="right"
                    tooltip="Original 1-based index of the request in the run. Sort or filter can reorder rows, but the # stays tied to the original probe."
                  >
                    #
                  </Th>
                  <Th tooltip="OK = the route returned success:true. FAIL = network error, abort, HTTP error, or success:false.">
                    Status
                  </Th>
                  <Th tooltip="Qualitative latency band (matches the bar-chart legend): fast < 50 ms / ok 50–200 / medium 200–500 / slow 500–1000 / very slow > 1000 / failed.">
                    Bucket
                  </Th>
                  <Th
                    align="right"
                    tooltip="Client round-trip: time measured in the browser from fetch start to JSON parse done. Includes network + server work + JSON decode."
                  >
                    Client
                  </Th>
                  <Th
                    align="right"
                    tooltip="Server-reported responseTime: only the time spent inside the route handler / SDK call. Network RTT is excluded."
                  >
                    Server
                  </Th>
                  <Th
                    align="right"
                    tooltip="Network overhead, computed as Client − Server. Approximates DNS / TCP / TLS / RTT plus browser fetch + JSON decode."
                  >
                    Network
                  </Th>
                  <Th
                    align="right"
                    tooltip="Approximate size of the response body in bytes (length of the JSON string, reported by the route)."
                  >
                    Size
                  </Th>
                  <Th tooltip="Wall-clock time (local) when the request was kicked off. Useful for spotting gaps and bursts in parallel mode.">
                    Started
                  </Th>
                  <Th tooltip="Error message returned by the route or thrown by fetch (network failure, abort, HTTP error).">
                    Error
                  </Th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => {
                  const bucket = bucketFor(r.time, r.success);
                  const network =
                    r.success && typeof r.serverTime === 'number'
                      ? r.time - r.serverTime
                      : null;
                  return (
                    <tr
                      key={r.index}
                      className="border-paper/5 hover:bg-paper/5 border-t"
                    >
                      <td className="text-paper/50 px-2 py-1 text-right">
                        {r.index + 1}
                      </td>
                      <td className="px-2 py-1">
                        {r.success ? (
                          <span className="text-emerald-300">OK</span>
                        ) : (
                          <span className="text-red-300">FAIL</span>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="inline-block size-2 rounded-sm"
                            style={{ backgroundColor: bucketColor[bucket] }}
                          />
                          <span className="text-paper/70">
                            {bucketLabel[bucket]}
                          </span>
                        </span>
                      </td>
                      <td className="px-2 py-1 text-right">
                        {r.success ? formatMs(r.time) : '—'}
                      </td>
                      <td className="text-paper/70 px-2 py-1 text-right">
                        {typeof r.serverTime === 'number'
                          ? formatMs(r.serverTime)
                          : '—'}
                      </td>
                      <td className="text-paper/60 px-2 py-1 text-right">
                        {network !== null ? formatMs(network) : '—'}
                      </td>
                      <td className="text-paper/60 px-2 py-1 text-right">
                        {typeof r.size === 'number' ? formatBytes(r.size) : '—'}
                      </td>
                      <td className="text-paper/60 px-2 py-1">
                        {new Date(r.startedAt).toLocaleTimeString()}
                      </td>
                      <td
                        className="max-w-80 truncate px-2 py-1 text-red-300"
                        title={r.error ?? ''}
                      >
                        {r.error ?? ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {tableRows.length === 0 && (
              <p className="text-paper/40 mt-2 text-center text-xs">
                No rows match the current filter.
              </p>
            )}
          </div>
        </section>
      )}

      {orderedResults.some((r) => !r.success) && (
        <section className="rounded-panel mt-4 border border-red-500/30 bg-red-500/10 p-4">
          <h2 className="mb-2 text-sm font-semibold text-red-200">Failures</h2>
          <ul className="space-y-1 text-xs text-red-100">
            {orderedResults
              .filter((r) => !r.success)
              .slice(0, 10)
              .map((r) => (
                <li key={r.index} className="font-mono">
                  #{r.index + 1}: {r.error ?? 'unknown error'}
                </li>
              ))}
          </ul>
        </section>
      )}

      {runs.length > 0 && (
        <section className="rounded-panel border-paper/10 mt-6 border bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="tracking-fine text-paper/70 text-sm font-semibold uppercase">
              Recent runs
            </h2>
            <button
              type="button"
              onClick={() => setRuns([])}
              className="text-paper/50 hover:text-paper text-xs"
            >
              Clear
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-xs tabular-nums">
              <thead>
                <tr className="tracking-fine text-paper/50 uppercase">
                  <th className="px-2 py-1 font-normal">Time</th>
                  <th className="px-2 py-1 font-normal">Preset</th>
                  <th className="px-2 py-1 font-normal">Marker</th>
                  <th className="px-2 py-1 font-normal">Mode</th>
                  <th className="px-2 py-1 font-normal">Cache</th>
                  <th className="px-2 py-1 font-normal">N</th>
                  <th className="px-2 py-1 font-normal">OK / Fail</th>
                  <th className="px-2 py-1 font-normal">Mean</th>
                  <th className="px-2 py-1 font-normal">p95</th>
                  <th className="px-2 py-1 font-normal">Buckets</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => {
                  const s = computeStats(
                    r.results.filter((x) => x.success).map((x) => x.time),
                  );
                  const ok = r.results.filter((x) => x.success).length;
                  return (
                    <tr key={r.id} className="border-paper/5 border-t">
                      <td className="text-paper/70 px-2 py-1">
                        {new Date(r.startedAt).toLocaleTimeString()}
                      </td>
                      <td className="px-2 py-1">{r.preset}</td>
                      <td className="text-paper/70 px-2 py-1">
                        {r.marker || '—'}
                      </td>
                      <td className="px-2 py-1">
                        {r.mode === 'parallel' ? `par×${r.concurrency}` : 'seq'}
                      </td>
                      <td className="px-2 py-1">
                        {r.cached ? 'cached' : 'raw'}
                      </td>
                      <td className="px-2 py-1">{r.count}</td>
                      <td className="px-2 py-1">
                        <span className="text-emerald-300">{ok}</span>
                        <span className="text-paper/40"> / </span>
                        <span
                          className={
                            ok < r.count ? 'text-red-300' : 'text-paper/40'
                          }
                        >
                          {r.count - ok}
                        </span>
                        {r.aborted && (
                          <span className="bg-paper/10 text-paper/60 ml-1 rounded px-1 text-[10px]">
                            stopped
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        {s ? formatMs(s.mean) : '—'}
                      </td>
                      <td className="px-2 py-1">{s ? formatMs(s.p95) : '—'}</td>
                      <td className="px-2 py-1">
                        <div className="flex h-3 w-32 overflow-hidden rounded-sm">
                          {r.results.map((req, i) => {
                            const b = bucketFor(req.time, req.success);
                            return (
                              <span
                                key={i}
                                style={{
                                  backgroundColor: bucketColor[b],
                                  width: `${100 / Math.max(1, r.results.length)}%`,
                                }}
                              />
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
