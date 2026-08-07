import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { candidates } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET all candidates
export async function GET() {
  try {
    const allCandidates = await db.select().from(candidates).orderBy(desc(candidates.createdAt));
    return NextResponse.json(allCandidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST create new candidate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newCandidate = await db.insert(candidates).values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      skills: body.skills,
      experience: body.experience,
      education: body.education,
      resume: body.resume,
      portfolio: body.portfolio,
    }).returning();

    return NextResponse.json(newCandidate[0], { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
}
