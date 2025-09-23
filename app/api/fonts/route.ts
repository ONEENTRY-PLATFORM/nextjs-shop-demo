import { NextResponse } from 'next/server';

// Простой кэш для шрифтов
const fontCache = new Map();

// Типы шрифтов и их MIME-типы
const FONT_TYPES: Record<string, string> = {
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  otf: 'font/otf',
  eot: 'application/vnd.ms-fontobject',
};

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const fontFile = pathname.split('/').pop();

  // Проверка кэша
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
    // Здесь должна быть логика получения шрифта из файловой системы или CDN
    // Временная заглушка для демонстрации

    // Определение типа шрифта по расширению
    const ext = fontFile?.split('.').pop() || '';
    const contentType = FONT_TYPES[ext] || 'font/woff2';

    // Создание пустого буфера в качестве примера
    const buffer = Buffer.from('');

    // Сохранение в кэш
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
    return new NextResponse('Font not found', { status: 404 });
  }
}

// Добавление CORS заголовков
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
