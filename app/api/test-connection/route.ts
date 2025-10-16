import { NextResponse } from 'next/server';

import { api } from '@/app/api';
import { LanguageEnum } from '@/app/types/enum';
import { handleApiError } from '@/app/utils/errorHandler';

/**
 * Test route for API calls
 * @returns {Promise<NextResponse>} - Promise object that represents the result of the GET request.
 */
export async function GET(): Promise<NextResponse> {
  try {
    /** Record start time for response time calculation */
    const startTime = Date.now();

    /** Test with a simple API call - replace 'home_web' with a known page URL in your system */
    const langCode = LanguageEnum.en;
    /** Fetch home page data to test API connectivity */
    const data = await api.Pages.getPageByUrl('home_web', langCode);

    /** Record end time for response time calculation */
    const endTime = Date.now();
    /** Calculate total response time in milliseconds */
    const responseTime = endTime - startTime;

    /** Return successful response with timing and data status */
    return NextResponse.json({
      success: true,
      responseTime,
      data: data ? 'Data received' : 'No data',
    });
  } catch (error) {
    /** Handle API connection errors */
    const apiError = handleApiError('function GET', error);
    /** Return error response with error message */
    return NextResponse.json({
      success: false,
      error: apiError.message,
    });
  }
}
