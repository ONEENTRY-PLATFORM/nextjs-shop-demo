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
      handle: 'about',
      title: 'About us',
      description: 'Some description',
      isVisible: true,
      lang: 'en',
      baseUrl: '',
    });
    expect(md.title).toBe('About us');
    expect(md.description).toBe('Some description');
  });
});

describe('generatePageMetadata — robots / isVisible', () => {
  it('isVisible=true makes the page indexable and followable (incl. googleBot)', () => {
    const md = generatePageMetadata({
      handle: 'h',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
      baseUrl: '',
    });
    expect(md.robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    });
  });

  it('isVisible=false hides the page from indexing/following everywhere', () => {
    const md = generatePageMetadata({
      handle: 'h',
      title: 't',
      description: 'd',
      isVisible: false,
      lang: 'en',
      baseUrl: '',
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
      handle: '',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
      baseUrl: '',
    });
    expect(md.alternates?.canonical).toBe('http://localhost:3000/en');
  });

  it('uses NEXT_PUBLIC_SITE_URL when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const md = generatePageMetadata({
      handle: '',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
      baseUrl: '',
    });
    expect(md.alternates?.canonical).toBe('https://example.com/en');
  });

  it('appends handle with a leading slash', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const md = generatePageMetadata({
      handle: 'about',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
      baseUrl: '',
    });
    expect(md.alternates?.canonical).toBe('https://example.com/en/about');
  });

  it('mirrors canonical onto the `en-US` language alternate', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const md = generatePageMetadata({
      handle: 'about',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
      baseUrl: '',
    });
    expect((md.alternates?.languages as Record<string, string>)['en-US']).toBe(
      md.alternates?.canonical,
    );
  });
});

describe('generatePageMetadata — openGraph image', () => {
  it('omits openGraph (null) when imageUrl is missing', () => {
    const md = generatePageMetadata({
      handle: 'h',
      title: 't',
      description: 'd',
      isVisible: true,
      lang: 'en',
      baseUrl: '',
    });
    expect(md.openGraph).toBeNull();
  });

  it('builds an openGraph image array with defaults (width/height=300, alt=title)', () => {
    const md = generatePageMetadata({
      handle: 'h',
      title: 'My Page',
      description: 'd',
      isVisible: true,
      imageUrl: 'https://cdn.example.com/og.jpg',
      lang: 'en',
      baseUrl: '',
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
      handle: 'h',
      title: 'My Page',
      description: 'd',
      isVisible: true,
      imageUrl: 'https://cdn.example.com/og.jpg',
      imageWidth: 1200,
      imageHeight: 630,
      imageAlt: 'Custom alt text',
      lang: 'en',
      baseUrl: '',
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
