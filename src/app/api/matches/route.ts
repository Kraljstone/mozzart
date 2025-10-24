import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = 'http://172.235.235.11/api/matches';

export async function GET(request: NextRequest) {
  try {
    // Get the username from query parameters or headers
    const { searchParams } = new URL(request.url);
    const username =
      searchParams.get('username') || request.headers.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const response = await axios.get(API_BASE_URL, {
      headers: {
        username: username,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error(
      'API Error:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'ECONNREFUSED' || errorCode === 'ENOTFOUND') {
        return NextResponse.json(
          { error: 'Unable to connect to the matches API' },
          { status: 503 }
        );
      }
      if (errorCode === 'ECONNABORTED') {
        return NextResponse.json(
          { error: 'Request timeout - API is taking too long to respond' },
          { status: 504 }
        );
      }
    }

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response: { status: number; statusText: string };
      };
      return NextResponse.json(
        {
          error: `API returned ${axiosError.response.status}: ${axiosError.response.statusText}`,
        },
        { status: axiosError.response.status }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching matches' },
      { status: 500 }
    );
  }
}
