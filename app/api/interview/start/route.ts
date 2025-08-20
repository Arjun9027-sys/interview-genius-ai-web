import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { jobCategory, jobSkill, technicalLanguage } = await request.json()

    // Forward to your Express server
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:3000'}/api/interview/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobCategory,
        jobSkill,
        technicalLanguage,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to start interview')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error starting interview:', error)
    return NextResponse.json(
      { error: 'Failed to start interview session' },
      { status: 500 }
    )
  }
}