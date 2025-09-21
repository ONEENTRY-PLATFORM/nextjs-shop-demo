import { NextResponse } from 'next/server';

import getLqipPreview from '@/app/api/lqip/getLqipPreview';

/**
 * API endpoint for generating low-quality image placeholders (LQIP)
 *
 * This endpoint generates a low-quality base64-encoded preview image that can be
 * used as a placeholder while the full quality image is loading.
 *
 * @param request - The incoming request with image URL in query parameters
 * @returns A JSON response with the base64-encoded LQIP data URI
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Missing image URL parameter' },
      { status: 400 },
    );
  }

  try {
    const preview = await getLqipPreview(imageUrl);
    return NextResponse.json({ preview });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating LQIP:', error);
    return NextResponse.json(
      { error: 'Failed to generate LQIP' },
      { status: 500 },
    );
  }
}
