// app/api/mcp/people/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { userFormSchema } from '@/app/actions/schemas'
import { z } from 'zod'

// Helper to verify API key (optional security layer)
function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  const expectedKey = process.env.MCP_API_KEY
  
  // If no API key is configured, allow all requests (for development)
  if (!expectedKey) return true
  
  return apiKey === expectedKey
}

// GET all people or search by query
export async function GET(request: NextRequest) {
  try {
    if (!verifyApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const limit = parseInt(searchParams.get('limit') || '50')

    let people

    if (query) {
      // Search by name
      people = await prisma.person.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        orderBy: {
          name: 'asc',
        },
        take: limit,
      })
    } else {
      // Get all people
      people = await prisma.person.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      })
    }

    return NextResponse.json({
      success: true,
      data: people,
      count: people.length,
    })
  } catch (error) {
    console.error('Error fetching people:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Create a new person
export async function POST(request: NextRequest) {
  try {
    if (!verifyApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = userFormSchema.parse(body)

    const newPerson = await prisma.person.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Person created successfully',
      data: newPerson,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating person:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
