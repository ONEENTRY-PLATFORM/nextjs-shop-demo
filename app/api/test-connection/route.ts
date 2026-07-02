import { type NextRequest, NextResponse } from 'next/server';

import { getApi } from '@/app/api';
import { getBlockByMarker } from '@/app/api/server/blocks/getBlockByMarker';
import { getMenuByMarker } from '@/app/api/server/menus/getMenuByMarker';
import { getPageByUrl } from '@/app/api/server/pages/getPageByUrl';
import { toLangCode } from '@/app/types/enum';
import { MENUS, PAGES } from '@/app/utils/constants';
import { handleApiError } from '@/app/utils/errorHandler';

export const dynamic = 'force-dynamic';

type Preset = 'page' | 'menu' | 'block' | 'products';

const DEFAULT_MARKER: Record<Preset, string> = {
  page: PAGES.home,
  menu: MENUS.mainWeb,
  block: '',
  products: '',
};

/**
 * isPreset — narrows a raw query-string value to a known benchmark preset.
 * @param   {string | null} v - Raw value of the `preset` query param.
 * @returns {unknown}         `true` when the value matches one of the supported presets.
 */
const isPreset = (v: string | null): v is Preset =>
  v === 'page' || v === 'menu' || v === 'block' || v === 'products';

/**
 * runRequest — executes the OneEntry SDK call selected by preset.
 *
 * For each preset branches between the cached server fetcher (`unstable_cache + cache()`)
 * and the raw `getApi().*` SDK method, so the dashboard can compare cold vs warm latency.
 * The `products` preset has no marker — it always calls `getProducts({}, lang, …)` with a
 * tiny page size to keep the probe cheap.
 * @param   {Preset}                                 preset - Family of OneEntry resource to query.
 * @param   {string}                                 marker - Marker / pageUrl. Empty allowed only for `products`; required for `block`.
 * @param   {string}                                 lang   - Short locale code from the route (e.g. `en`); converted to the SDK code for raw calls.
 * @param   {boolean}                                cached - When true, use the project's `unstable_cache`-wrapped fetcher.
 * @returns {Promise<{ ok: boolean; size: number }>}        Promise resolving to a minimal payload signature `{ ok, size }`.
 */
const runRequest = async (
  preset: Preset,
  marker: string,
  lang: string,
  cached: boolean,
): Promise<{ ok: boolean; size: number }> => {
  const langCode = toLangCode(lang);
  if (preset === 'page') {
    const m = marker || DEFAULT_MARKER.page;
    if (cached) {
      const { isError, page } = await getPageByUrl(m, lang);
      return { ok: !isError, size: page ? JSON.stringify(page).length : 0 };
    }
    const data = await getApi().Pages.getPageByUrl(m, langCode);
    return { ok: !!data, size: data ? JSON.stringify(data).length : 0 };
  }
  if (preset === 'menu') {
    const m = marker || DEFAULT_MARKER.menu;
    if (cached) {
      const { isError, menu } = await getMenuByMarker(m, lang);
      return { ok: !isError, size: menu ? JSON.stringify(menu).length : 0 };
    }
    const data = await getApi().Menus.getMenusByMarker(m, langCode);
    return { ok: !!data, size: data ? JSON.stringify(data).length : 0 };
  }
  if (preset === 'block') {
    if (!marker)
      throw new Error('Block preset requires a `marker` query param');
    if (cached) {
      const { isError, block } = await getBlockByMarker(marker, lang);
      return { ok: !isError, size: block ? JSON.stringify(block).length : 0 };
    }
    const data = await getApi().Blocks.getBlockByMarker(marker, langCode);
    return { ok: !!data, size: data ? JSON.stringify(data).length : 0 };
  }
  const data = await getApi().Products.getProducts([], langCode, {
    offset: 0,
    limit: 12,
  });
  return { ok: !!data, size: data ? JSON.stringify(data).length : 0 };
};

/**
 * GET — OneEntry API benchmark probe.
 *
 * Reads `preset`, `marker`, `lang`, `cached` from the query string, dispatches to the
 * matching SDK call, and reports the server-side response time. Disabled in production
 * (returns 404). Response carries `Cache-Control: no-store` so consecutive probes from
 * the dashboard are never served from the browser HTTP cache.
 * @param   {NextRequest}           request - Incoming request with benchmark query params.
 * @returns {Promise<NextResponse>}         Promise resolving to JSON `{ success, responseTime, preset, marker, cached, size }` or `{ success: false, error }`.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not Found', { status: 404 });
  }
  const sp = request.nextUrl.searchParams;
  const presetParam = sp.get('preset');
  const preset: Preset = isPreset(presetParam) ? presetParam : 'page';
  const marker = sp.get('marker') ?? DEFAULT_MARKER[preset];
  const lang = sp.get('lang') ?? 'en';
  const cached = sp.get('cached') === '1';

  const noStore = { 'Cache-Control': 'no-store, max-age=0' } as const;

  try {
    const startTime = performance.now();
    const result = await runRequest(preset, marker, lang, cached);
    const responseTime = performance.now() - startTime;

    return NextResponse.json(
      {
        success: result.ok,
        responseTime,
        preset,
        marker,
        cached,
        size: result.size,
      },
      { headers: noStore },
    );
  } catch (error) {
    const apiError = handleApiError('test-connection GET', error);
    return NextResponse.json(
      {
        success: false,
        preset,
        marker,
        cached,
        error: apiError.message,
      },
      { headers: noStore },
    );
  }
}
