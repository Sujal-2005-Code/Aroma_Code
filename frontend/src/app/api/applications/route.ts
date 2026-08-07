import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { applications, candidates, jobs } from '@/db/schema';
import { desc, eq, and, ilike, or, inArray, sql } from 'drizzle-orm';

// GET applications with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const skills = searchParams.get('skills');
    const education = searchParams.get('education');
    const experience = searchParams.get('experience');
    const minScore = searchParams.get('minScore');

    // Build the query
    let query = db
      .select({
        application: applications,
        candidate: candidates,
        job: jobs,
      })
      .from(applications)
      .leftJoin(candidates, eq(applications.candidateId, candidates.id))
      .leftJoin(jobs, eq(applications.jobId, jobs.id))
      .orderBy(desc(applications.appliedAt));

    // Apply filters
    const conditions = [];

    if (jobId) {
      conditions.push(eq(applications.jobId, parseInt(jobId)));
    }

    if (status) {
      conditions.push(eq(applications.status, status));
    }

    if (minScore) {
      conditions.push(sql`${applications.aiSkillMatchScore} >= ${parseInt(minScore)}`);
    }

    // Execute query with conditions
    let results = await query;

    // Apply client-side filters for complex conditions
    if (search) {
      results = results.filter(r =>
        r.candidate?.name.toLowerCase().includes(search.toLowerCase()) ||
        r.candidate?.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim().toLowerCase());
      results = results.filter(r =>
        r.candidate?.skills.some(s =>
          skillArray.some(searchSkill => s.toLowerCase().includes(searchSkill))
        )
      );
    }

    if (education) {
      results = results.filter(r =>
        r.candidate?.education.toLowerCase().includes(education.toLowerCase())
      );
    }

    if (experience) {
      results = results.filter(r =>
        r.candidate?.experience.toLowerCase().includes(experience.toLowerCase())
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// POST create new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Calculate AI Skill Match Score
    const job = await db.select().from(jobs).where(eq(jobs.id, body.jobId)).limit(1);
    const candidate = await db.select().from(candidates).where(eq(candidates.id, body.candidateId)).limit(1);

    let aiSkillMatchScore = 0;
    if (job[0] && candidate[0]) {
      const jobSkills = job[0].skills.map(s => s.toLowerCase());
      const candidateSkills = candidate[0].skills.map(s => s.toLowerCase());
      const matchedSkills = candidateSkills.filter(cs =>
        jobSkills.some(js => cs.includes(js) || js.includes(cs))
      );
      aiSkillMatchScore = Math.min(100, Math.round((matchedSkills.length / jobSkills.length) * 100));
    }

    const newApplication = await db.insert(applications).values({
      jobId: body.jobId,
      candidateId: body.candidateId,
      coverLetter: body.coverLetter,
      status: 'applied',
      aiSkillMatchScore,
    }).returning();

    return NextResponse.json(newApplication[0], { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}

// PATCH update application status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (updates.interviewScheduled) {
      updates.interviewScheduled = new Date(updates.interviewScheduled);
    }

    const updatedApplication = await db.update(applications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();

    return NextResponse.json(updatedApplication[0]);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
