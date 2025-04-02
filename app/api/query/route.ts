import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const formData = new FormData();
    formData.append('file_id', body.document_id);
    formData.append('user_query', body.query);

    const response = await fetch('https://lm6ho2elrl.execute-api.us-east-2.amazonaws.com/dev/query', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'Failed to get response from backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in query API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 