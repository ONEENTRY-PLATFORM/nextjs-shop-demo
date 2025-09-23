import { NextResponse } from 'next/server';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';

export async function GET() {
  try {
    const startTime = Date.now();

    // Test with a simple API call - replace 'home_web' with a known page URL in your system
    const langCode = LanguageEnum.en; // Use default language for test
    const data = await api.Pages.getPageByUrl('home_web', langCode);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return NextResponse.json({
      success: true,
      responseTime,
      data: data ? 'Data received' : 'No data',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
