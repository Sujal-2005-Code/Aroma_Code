import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { jobs } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

// GET all jobs
export async function GET() {
  try {
    const allJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
    return NextResponse.json(allJobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newJob = await db.insert(jobs).values({
      title: body.title,
      companyName: body.companyName,
      location: body.location,
      salary: body.salary,
      jobType: body.jobType,
      skills: body.skills,
      experience: body.experience,
      description: body.description,
      applicationDeadline: new Date(body.applicationDeadline),
      companyLogo: body.companyLogo,
      status: 'active',
    }).returning();

    return NextResponse.json(newJob[0], { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

// PATCH update job
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (updates.applicationDeadline) {
      updates.applicationDeadline = new Date(updates.applicationDeadline);
    }

    const updatedJob = await db.update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();

    return NextResponse.json(updatedJob[0]);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}
