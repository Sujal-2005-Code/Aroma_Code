import { NextRequest, NextResponse } from "next/server";
import { type Document, ObjectId } from "mongodb";
import { getMongoDatabase } from "@/lib/server/mongodb";

type CandidateDocument = Document & {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: string;
  education: string;
  resume?: string;
  portfolio?: string;
  createdAt: Date;
};

function serializeCandidate({ _id, ...candidate }: CandidateDocument & { _id: ObjectId }) {
  return { ...candidate, id: candidate.id ?? _id.toHexString() };
}

export async function GET() {
  try {
    const database = await getMongoDatabase();
    const candidates = await database.collection<CandidateDocument>("candidates").find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json(candidates.map(serializeCandidate));
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const candidate: CandidateDocument = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      skills: Array.isArray(body.skills) ? body.skills : [],
      experience: body.experience,
      education: body.education,
      resume: body.resume,
      portfolio: body.portfolio,
      createdAt: new Date(),
    };

    const database = await getMongoDatabase();
    const result = await database.collection<CandidateDocument>("candidates").insertOne(candidate);
    return NextResponse.json(serializeCandidate({ ...candidate, _id: result.insertedId }), { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 });
  }
}
