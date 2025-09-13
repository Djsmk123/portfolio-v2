import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get search params from the request
    
    // Return a simple JSON response
    return NextResponse.json({
      message: 'Service is running',
      timestamp: new Date().toISOString(),
      status: 'success'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        message: 'Internal Server Error',
        status: 'error' 
      },
      { status: 500 }
    )
  }
}
