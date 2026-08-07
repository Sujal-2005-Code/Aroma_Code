import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Document, type Filter, type WithId } from "mongodb";
import { getMongoDatabase } from "@/lib/server/mongodb";

type CandidateDocument = Document & {
  id?: string;
  name: string;
  email: string;
  skills?: string[];
  education?: string;
  experience?: string;
};

type JobDocument = Document & {
  id?: string;
  skills?: string[];
};

type ApplicationDocument = Document & {
  id?: string;
  jobId: string;
  candidateId: string;
  coverLetter?: string;
  status: string;
  aiSkillMatchScore: number;
  appliedAt: Date;
  updatedAt: Date;
  interviewScheduled?: Date;
  interviewNotes?: string;
};

function identifierFilter<T extends Document>(id: unknown): Filter<T> {
  const value = String(id);
  return ObjectId.isValid(value)
    ? ({ $or: [{ _id: new ObjectId(value) }, { id: value }] } as Filter<T>)
    : ({ id: value } as unknown as Filter<T>);
}

function serializeDocument<T extends Document>({ _id, ...document }: WithId<T>): Omit<T, "_id"> & { id: string } {
  return { ...document, id: String(document.id ?? _id.toHexString()) } as Omit<T, "_id"> & { id: string };
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.toLocaleLowerCase() : "";
}

export async function GET(request: NextRequest) {
  try {
    const database = await getMongoDatabase();
    const { searchParams } = request.nextUrl;
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");
    const search = normalizeText(searchParams.get("search"));
    const skills = searchParams.get("skills");
    const education = normalizeText(searchParams.get("education"));
    const experience = normalizeText(searchParams.get("experience"));
    const minScore = Number(searchParams.get("minScore") ?? 0);
    const filter: Filter<ApplicationDocument> = {};

    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;
    if (Number.isFinite(minScore) && minScore > 0) filter.aiSkillMatchScore = { $gte: minScore };

    const applications = await database.collection<ApplicationDocument>("applications").find(filter).sort({ appliedAt: -1 }).toArray();
    const candidateIds = [...new Set(applications.map((application) => application.candidateId))];
    const jobIds = [...new Set(applications.map((application) => application.jobId))];
    const [candidates, jobs] = await Promise.all([
      candidateIds.length
        ? database.collection<CandidateDocument>("candidates").find({ $or: candidateIds.map((id) => identifierFilter<CandidateDocument>(id)) }).toArray()
        : Promise.resolve([]),
      jobIds.length
        ? database.collection<JobDocument>("jobs").find({ $or: jobIds.map((id) => identifierFilter<JobDocument>(id)) }).toArray()
        : Promise.resolve([]),
    ]);
    const candidateById = new Map<string, CandidateDocument & { id: string }>(
      candidates.map((candidate) => [candidate.id ?? candidate._id.toHexString(), serializeDocument(candidate) as CandidateDocument & { id: string }]),
    );
    const jobById = new Map<string, JobDocument & { id: string }>(
      jobs.map((job) => [job.id ?? job._id.toHexString(), serializeDocument(job) as JobDocument & { id: string }]),
    );
    const requiredSkills = skills?.split(",").map(normalizeText).filter(Boolean) ?? [];

    const results = applications
      .map((application) => ({
        application: serializeDocument(application),
        candidate: candidateById.get(application.candidateId) ?? null,
        job: jobById.get(application.jobId) ?? null,
      }))
      .filter(({ candidate }) => {
        if (!candidate) return !search && requiredSkills.length === 0 && !education && !experience;
        if (search && !normalizeText(candidate.name).includes(search) && !normalizeText(candidate.email).includes(search)) return false;
        if (requiredSkills.length && !candidate.skills?.some((skill) => requiredSkills.some((required) => normalizeText(skill).includes(required)))) return false;
        if (education && !normalizeText(candidate.education).includes(education)) return false;
        return !experience || normalizeText(candidate.experience).includes(experience);
      });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const database = await getMongoDatabase();
    const [job, candidate] = await Promise.all([
      database.collection<JobDocument>("jobs").findOne(identifierFilter<JobDocument>(body.jobId)),
      database.collection<CandidateDocument>("candidates").findOne(identifierFilter<CandidateDocument>(body.candidateId)),
    ]);
    const jobSkills = job?.skills?.map(normalizeText) ?? [];
    const candidateSkills = candidate?.skills?.map(normalizeText) ?? [];
    const matchedSkills = candidateSkills.filter((candidateSkill) => jobSkills.some((jobSkill) => candidateSkill.includes(jobSkill) || jobSkill.includes(candidateSkill)));
    const aiSkillMatchScore = jobSkills.length ? Math.min(100, Math.round((matchedSkills.length / jobSkills.length) * 100)) : 0;
    const now = new Date();
    const application: ApplicationDocument = {
      jobId: String(body.jobId),
      candidateId: String(body.candidateId),
      coverLetter: body.coverLetter,
      status: "applied",
      aiSkillMatchScore,
      appliedAt: now,
      updatedAt: now,
    };
    const result = await database.collection<ApplicationDocument>("applications").insertOne(application);
    return NextResponse.json(serializeDocument({ ...application, _id: result.insertedId }), { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, interviewScheduled, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "Application id is required" }, { status: 400 });

    if (interviewScheduled) updates.interviewScheduled = new Date(interviewScheduled);
    const database = await getMongoDatabase();
    const applications = database.collection<ApplicationDocument>("applications");
    await applications.updateOne(identifierFilter<ApplicationDocument>(id), { $set: { ...updates, updatedAt: new Date() } });
    const updated = await applications.findOne(identifierFilter<ApplicationDocument>(id));

    if (!updated) return NextResponse.json({ error: "Application not found" }, { status: 404 });
    return NextResponse.json(serializeDocument(updated));
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
