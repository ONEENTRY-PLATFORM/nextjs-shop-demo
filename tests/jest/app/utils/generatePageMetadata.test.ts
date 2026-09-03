import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { generatePageMetadata } from '@/app/utils/generatePageMetadata';

const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
});

afterEach(() => {
  if (ORIGINAL_SITE_URL !== undefined) {
    process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL;
  } else {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  }
});

describe('generatePageMetadata — title / description', () => {
  it('passes title and description through verbatim', () => {
    const md = generatePageMetadata({
      path: '/about',
      title: 'About us',
      description: 'Some description',
      isVisible: true,
      lang: 'en',
    });
    expect(md.title).toBe('About us');
    expect(md.description).toBe('Some description');
  });
});

describe('generatePageMetadata — robots / isVisible', () => {
  it('isVisible=true makes the page indexable and followable (incl. googleBot)', () => {
    const md = generatePageMetadata({
      path: '/h',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
    });
    expect(md.robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    });
  });

  it('isVisible=false hides the page from indexing/following everywhere', () => {
    const md = generatePageMetadata({
      path: '/h',
      title: 't',
      description: 'd',
      isVisible: false,
      lang: 'en',
    });
    expect(md.robots).toEqual({
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
  });
});

describe('generatePageMetadata — canonical URL', () => {
  // Unlike the restaurant project, the canonical here always contains the
  // `/{lang}` segment, and `alternates.languages` is keyed by
  // `i18n.localesData` ('en-US' / 'fr-FR').
  it('falls back to localhost:3000 when NEXT_PUBLIC_SITE_URL is not set', () => {
    const md = generatePageMetadata({
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
    });
    expect(md.alternates?.canonical).toBe('http://localhost:3000/en');
  });

  it('uses NEXT_PUBLIC_SITE_URL when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const md = generatePageMetadata({
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
    });
    expect(md.alternates?.canonical).toBe('https://example.com/en');
  });

  it('appends the route path after the locale segment', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const md = generatePageMetadata({
      path: '/about',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
    });
    expect(md.alternates?.canonical).toBe('https://example.com/en/about');
  });

  it('mirrors canonical onto the `en-US` language alternate', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const md = generatePageMetadata({
      path: '/about',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
    });
    expect((md.alternates?.languages as Record<string, string>)['en-US']).toBe(
      md.alternates?.canonical,
    );
  });
});

describe('generatePageMetadata — canonical regressions', () => {
  /*
    These cover what the previous `baseUrl` + `handle` pair got wrong. Every old
    test passed `baseUrl: ''`, so the combination that actually shipped — a full
    path in `baseUrl` plus the same segment again in `handle` — was never
    exercised, and the bug survived behind a green suite.
  */
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
  });

  it('emits a nested path once, with no duplicated locale or segment', () => {
    const md = generatePageMetadata({
      path: '/shop/product/42',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
    });
    // Previously: https://example.com/en/en/shop/product/42//42
    expect(md.alternates?.canonical).toBe(
      'https://example.com/en/shop/product/42',
    );
  });

  it('never emits a doubled slash, whatever the caller passes', () => {
    for (const path of ['/shop/', 'shop', '//shop//']) {
      const md = generatePageMetadata({
        path,
        title: 't',
        description: 'd',
        isVisible: true,
        lang: 'en',
      });
      expect(md.alternates?.canonical).toBe('https://example.com/en/shop');
    }
  });

  it('gives home, /shop and /shop/category three distinct canonicals', () => {
    const canonicalFor = (path?: string): string | undefined => {
      const md = generatePageMetadata({
        ...(path ? { path } : {}),
        title: 't',
        description: 'd',
        isVisible: true,
        lang: 'en',
      });
      return md.alternates?.canonical as string | undefined;
    };

    // All three used to collapse onto `https://example.com/en`, telling the
    // crawler that two real catalog pages were duplicates of the home page.
    const canonicals = [
      canonicalFor(),
      canonicalFor('/shop'),
      canonicalFor('/shop/category'),
    ];
    expect(new Set(canonicals).size).toBe(3);
    expect(canonicals).toEqual([
      'https://example.com/en',
      'https://example.com/en/shop',
      'https://example.com/en/shop/category',
    ]);
  });

  it('applies the same path to every language alternate', () => {
    const md = generatePageMetadata({
      path: '/shop/product/42',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
    });
    const languages = md.alternates?.languages as Record<string, string>;
    for (const url of Object.values(languages)) {
      expect(url).toMatch(
        /^https:\/\/example\.com\/[a-z]{2}\/shop\/product\/42$/,
      );
    }
  });
});

describe('generatePageMetadata — openGraph image', () => {
  it('omits openGraph (null) when imageUrl is missing', () => {
    const md = generatePageMetadata({
      path: '/h',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
    });
    expect(md.openGraph).toBeNull();
  });

  it('builds an openGraph image array with defaults (width/height=300, alt=title)', () => {
    const md = generatePageMetadata({
      path: '/h',
      title: 'My Page',
      description: 'd',
      isVisible: true,
      imageUrl: 'https://cdn.example.com/og.jpg',
      lang: 'en',
    });
    expect(md.openGraph).toMatchObject({
      images: [
        {
          url: 'https://cdn.example.com/og.jpg',
          width: 300,
          height: 300,
          alt: 'My Page', // defaults to title
        },
      ],
    });
  });

  it('uses explicit imageWidth/imageHeight/imageAlt when provided', () => {
    const md = generatePageMetadata({
      path: '/h',
      title: 'My Page',
      description: 'd',
      isVisible: true,
      imageUrl: 'https://cdn.example.com/og.jpg',
      imageWidth: 1200,
      imageHeight: 630,
      imageAlt: 'Custom alt text',
      lang: 'en',
    });
    expect(md.openGraph).toMatchObject({
      images: [
        {
          url: 'https://cdn.example.com/og.jpg',
          width: 1200,
          height: 630,
          alt: 'Custom alt text',
        },
      ],
    });
  });
});
