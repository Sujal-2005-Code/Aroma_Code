import { ObjectId } from "mongodb";
import { getMongoDatabase } from "@/lib/server/mongodb";
import { generateAiAvatar } from "@/lib/avatar";
import {
  normalizeProfile,
  type ActivityItem,
  type ProfileData,
  type StoredProfile,
} from "@/lib/profile";
import { computeCompletion, computeScores, generateInsights } from "@/lib/scoring";

export const DEFAULT_SLUG = "demo-candidate";

function seedProfile(): ProfileData {
  const name = "Aarav Sharma";
  return {
    fullName: name,
    headline: "Final-year CSE · AI & Full-Stack Engineer · Building agentic products",
    about:
      "I build AI-native products end to end — from retrieval pipelines and evals to polished React interfaces. Last year I shipped a RAG assistant used by 4,200+ campus students, cut inference cost by 46% with caching + quantization, and placed in the top 3% on LeetCode contests. Looking for an AI/Full-stack role where I can own features from spec to production.",
    email: "aarav.sharma@campus.edu",
    phone: "+91 98765 43210",
    dob: "2004-03-18",
    gender: "Prefer not to say",
    location: "Bengaluru, Karnataka, India",
    photoUrl: generateAiAvatar("aroma-seed-3", name),
    photoKind: "ai",
    education: [
      {
        id: "edu_seed_1",
        college: "PES Institute of Technology",
        university: "Visvesvaraya Technological University",
        degree: "B.Tech",
        branch: "Computer Science & Engineering",
        graduationYear: "2026",
        cgpa: "9.1",
        semester: "7th",
      },
    ],
    experience: [
      {
        id: "exp_seed_1",
        company: "Nebula Labs",
        title: "AI Engineering Intern",
        employmentType: "Internship",
        startDate: "2025-05",
        endDate: "2025-08",
        current: false,
        description:
          "• Built a production RAG service (FastAPI + pgvector) serving 120k queries/month at p95 < 480ms.\n• Cut LLM spend 46% via semantic caching and prompt compression.\n• Shipped an eval harness that raised answer accuracy from 71% → 89%.",
      },
      {
        id: "exp_seed_2",
        company: "OpenCampus OSS",
        title: "Open Source Contributor",
        employmentType: "Open Source",
        startDate: "2024-11",
        endDate: "",
        current: true,
        description:
          "• Merged 23 PRs across the design-system and CLI repos.\n• Authored the accessibility audit that fixed 40+ WCAG violations.",
      },
    ],
    projects: [
      {
        id: "prj_seed_1",
        name: "AROMA Resume Intelligence",
        description:
          "An ATS simulator that scores resumes against live job descriptions, highlights missing keywords and rewrites weak bullets with an LLM. 4.2k monthly active students.",
        tech: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "OpenAI"],
        github: "github.com/aaravsharma/aroma-resume-iq",
        demo: "aroma-resume.vercel.app",
      },
      {
        id: "prj_seed_2",
        name: "CampusPilot Agent",
        description:
          "Multi-agent assistant that plans study schedules, tracks placement deadlines and drafts outreach emails. Tool-calling with guardrails and human-in-the-loop review.",
        tech: ["LangChain", "Python", "Redis", "React"],
        github: "github.com/aaravsharma/campuspilot",
        demo: "",
      },
    ],
    skills: {
      programming: ["Python", "TypeScript", "JavaScript", "C++", "SQL"],
      frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
      backend: ["Node.js", "FastAPI", "Express", "Docker"],
      database: ["PostgreSQL", "Redis", "pgvector"],
      aiml: ["PyTorch", "LangChain", "RAG", "Scikit-learn"],
      tools: ["Git", "GitHub Actions", "Figma", "AWS"],
      soft: ["Communication", "Ownership", "Mentoring"],
    },
    certifications: [
      {
        id: "cert_seed_1",
        name: "AWS Certified Cloud Practitioner",
        issuedBy: "Amazon Web Services",
        issueDate: "2025-02",
        fileName: "",
        fileUrl: "",
      },
      {
        id: "cert_seed_2",
        name: "Machine Learning Specialization",
        issuedBy: "DeepLearning.AI",
        issueDate: "2024-09",
        fileName: "",
        fileUrl: "",
      },
    ],
    social: {
      linkedin: "linkedin.com/in/aarav-sharma",
      github: "github.com/aaravsharma",
      portfolio: "aarav.dev",
      leetcode: "leetcode.com/u/aarav",
      hackerrank: "hackerrank.com/aarav",
      codechef: "codechef.com/users/aarav",
      codeforces: "",
      geeksforgeeks: "geeksforgeeks.org/user/aarav",
      twitter: "x.com/aaravbuilds",
    },
    resume: null,
    preferences: {
      role: "AI/ML Engineer",
      location: "Bengaluru · Hyderabad · Remote (India)",
      salary: "₹ 14–20 LPA",
      workMode: "Hybrid",
      noticePeriod: "Available from June 2026",
    },
  };
}

type ProfileDocument = {
  _id?: ObjectId;
  slug: string;
  status: "draft" | "published";
  completion: number;
  scores?: ReturnType<typeof computeScores>;
  insights?: string[];
  data: ProfileData;
  updatedAt: Date;
  createdAt: Date;
  fullName: string;
  headline: string;
  email: string;
};

type ActivityDocument = {
  _id?: ObjectId;
  slug: string;
  action: string;
  message: string;
  createdAt: Date;
};

function toStored(row: ProfileDocument): StoredProfile {
  const data = normalizeProfile(row.data);
  const scores = row.scores ?? computeScores(data);
  return {
    slug: row.slug,
    status: row.status === "published" ? "published" : "draft",
    completion: row.completion,
    scores,
    insights: row.insights ?? generateInsights(data, scores),
    updatedAt: row.updatedAt.toISOString(),
    data,
  };
}

async function profileCollections() {
  const database = await getMongoDatabase();
  return {
    profiles: database.collection<ProfileDocument>("candidate_profiles"),
    activity: database.collection<ActivityDocument>("profile_activity"),
  };
}

export async function ensureProfileRow(slug: string): Promise<ProfileDocument> {
  const { profiles, activity } = await profileCollections();
  const existing = await profiles.findOne({ slug });
  if (existing) return existing;

  const data = slug === DEFAULT_SLUG ? seedProfile() : normalizeProfile(null);
  const scores = computeScores(data);
  const now = new Date();
  const profile: ProfileDocument = {
    slug,
    fullName: data.fullName,
    headline: data.headline,
    email: data.email,
    status: "draft",
    data,
    completion: computeCompletion(data),
    scores,
    insights: generateInsights(data, scores),
    createdAt: now,
    updatedAt: now,
  };
  const inserted = await profiles.insertOne(profile);
  await activity.insertOne({ slug, action: "create", message: "Profile workspace created by AROMA onboarding", createdAt: now });

  return { ...profile, _id: inserted.insertedId };
}

export async function getProfileBundle(
  slug: string,
): Promise<{ profile: StoredProfile; activity: ActivityItem[] }> {
  const [row, { activity }] = await Promise.all([ensureProfileRow(slug), profileCollections()]);
  const entries = await activity.find({ slug }).sort({ createdAt: -1 }).limit(6).toArray();

  return {
    profile: toStored(row),
    activity: entries.map((entry) => ({
      id: entry._id?.toHexString() ?? `${entry.slug}-${entry.createdAt.getTime()}`,
      action: entry.action,
      message: entry.message,
      createdAt: entry.createdAt.toISOString(),
    })),
  };
}

export async function saveProfile(input: {
  slug: string;
  status: "draft" | "published";
  data: ProfileData;
}): Promise<{ profile: StoredProfile; activity: ActivityItem[] }> {
  const data = normalizeProfile(input.data);
  const completion = computeCompletion(data);
  const scores = computeScores(data);
  const insights = generateInsights(data, scores);

  await ensureProfileRow(input.slug);
  const { profiles, activity } = await profileCollections();
  const now = new Date();
  await profiles.updateOne(
    { slug: input.slug },
    { $set: { fullName: data.fullName, headline: data.headline, email: data.email, status: input.status, completion, scores, insights, data, updatedAt: now } },
  );
  const updated = await profiles.findOne({ slug: input.slug });
  if (!updated) throw new Error("Profile was not found after saving");

  await activity.insertOne({
    slug: input.slug,
    action: input.status === "published" ? "publish" : "draft",
    message:
      input.status === "published"
        ? `Profile updated & published · ${completion}% complete · AI score ${scores.overall}`
        : `Draft saved · ${completion}% complete · AI score ${scores.overall}`,
    createdAt: now,
  });

  const entries = await activity.find({ slug: input.slug }).sort({ createdAt: -1 }).limit(6).toArray();

  return {
    profile: toStored(updated),
    activity: entries.map((entry) => ({
      id: entry._id?.toHexString() ?? `${entry.slug}-${entry.createdAt.getTime()}`,
      action: entry.action,
      message: entry.message,
      createdAt: entry.createdAt.toISOString(),
    })),
  };
}
