import { NextResponse } from 'next/server';

/**
 * Simple in-memory cache for font files to improve performance
 * Maps font filenames to their buffer data and content types
 */
const fontCache = new Map();

/**
 * Font file extensions mapped to their corresponding MIME types
 * This ensures proper Content-Type headers when serving fonts
 */
const FONT_TYPES: Record<string, string> = {
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  otf: 'font/otf',
  eot: 'application/vnd.ms-fontobject',
};

/**
 * GET endpoint for serving font files with caching support
 * @param   {Request}               request - The incoming HTTP request
 * @returns {Promise<NextResponse>}         NextResponse with font file data or error
 */
export async function GET(request: Request): Promise<NextResponse> {
  // Extract font filename from the URL path
  const { pathname } = new URL(request.url);
  const fontFile = pathname.split('/').pop();

  // Check if font is already cached to avoid unnecessary processing
  if (fontCache.has(fontFile)) {
    const cached = fontCache.get(fontFile);
    const response = new NextResponse(cached.buffer, {
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Encoding': 'gzip',
      },
    });
    return response;
  }

  try {
    // Font retrieval logic would go here - from filesystem or CDN
    // Currently using a placeholder implementation for demonstration

    // Determine font MIME type based on file extension
    const ext = fontFile?.split('.').pop() || '';
    const contentType = FONT_TYPES[ext] || 'font/woff2';

    // Create empty buffer as placeholder - real implementation would load actual font data
    const buffer = Buffer.from('');

    // Store font in cache for future requests
    fontCache.set(fontFile, { buffer, contentType });

    const response = new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Encoding': 'gzip',
      },
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Return 404 error if font cannot be retrieved
    return new NextResponse('Font not found', { status: 404 });
  }
}

/**
 * OPTIONS endpoint for handling CORS preflight requests
 * @returns {Promise<NextResponse>} NextResponse with CORS headers
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
