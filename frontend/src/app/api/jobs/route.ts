import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Document, type Filter } from "mongodb";
import { getMongoDatabase } from "@/lib/server/mongodb";

type JobDocument = Document & {
  id?: string;
  title: string;
  companyName: string;
  location: string;
  salary?: string;
  jobType: string;
  skills: string[];
  experience: string;
  description: string;
  applicationDeadline: Date;
  companyLogo?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

function identifierFilter(id: unknown): Filter<JobDocument> {
  const value = String(id);
  return ObjectId.isValid(value)
    ? { $or: [{ _id: new ObjectId(value) }, { id: value }] }
    : { id: value };
}

function serializeJob({ _id, ...job }: JobDocument & { _id: ObjectId }) {
  return { ...job, id: job.id ?? _id.toHexString() };
}

export async function GET() {
  try {
    const database = await getMongoDatabase();
    const jobs = await database.collection<JobDocument>("jobs").find().sort({ createdAt: -1, created_at: -1 }).toArray();
    return NextResponse.json(jobs.map(serializeJob));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date();
    const job: JobDocument = {
      title: body.title,
      companyName: body.companyName,
      location: body.location,
      salary: body.salary,
      jobType: body.jobType,
      skills: Array.isArray(body.skills) ? body.skills : [],
      experience: body.experience,
      description: body.description,
      applicationDeadline: new Date(body.applicationDeadline),
      companyLogo: body.companyLogo,
      status: body.status ?? "active",
      createdAt: now,
      updatedAt: now,
    };

    const database = await getMongoDatabase();
    const result = await database.collection<JobDocument>("jobs").insertOne(job);
    return NextResponse.json(serializeJob({ ...job, _id: result.insertedId }), { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, applicationDeadline, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "Job id is required" }, { status: 400 });

    if (applicationDeadline) updates.applicationDeadline = new Date(applicationDeadline);
    const database = await getMongoDatabase();
    const jobs = database.collection<JobDocument>("jobs");
    await jobs.updateOne(identifierFilter(id), { $set: { ...updates, updatedAt: new Date() } });
    const updated = await jobs.findOne(identifierFilter(id));

    if (!updated) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(serializeJob(updated));
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
