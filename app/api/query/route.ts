import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    console.log('Sending request to Lambda with:', {
      file_id: body.document_id,
      user_query: body.query
    });

    const response = await fetch('https://lm6ho2elrl.execute-api.us-east-2.amazonaws.com/dev/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file_id: body.document_id,
        user_query: body.query
      })
    });

    console.log('Lambda response status:', response.status);
    const responseText = await response.text();
    console.log('Lambda response text:', responseText);

    if (!response.ok) {
      let error;
      try {
        error = JSON.parse(responseText);
      } catch (e) {
        error = { detail: responseText };
      }
      console.error('Lambda error:', error);
      return NextResponse.json(
        { error: error.detail || 'Failed to get response from backend' },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Lambda response:', e);
      return NextResponse.json(
        { error: 'Invalid response format from backend' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in query API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 