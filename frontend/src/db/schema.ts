import { integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import type { ProfileData, SkillScores } from "@/lib/profile";

export const candidateProfiles = pgTable("candidate_profiles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  fullName: text("full_name").notNull().default(""),
  headline: text("headline").notNull().default(""),
  email: text("email").notNull().default(""),
  status: varchar("status", { length: 16 }).notNull().default("draft"),
  completion: integer("completion").notNull().default(0),
  scores: jsonb("scores").$type<SkillScores>(),
  insights: jsonb("insights").$type<string[]>(),
  data: jsonb("data").$type<ProfileData>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const profileActivity = pgTable("profile_activity", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull(),
  action: varchar("action", { length: 32 }).notNull(),
  message: text("message").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Jobs table (for recruiter functionality)
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  companyName: text('company_name').notNull(),
  location: text('location').notNull(),
  salary: text('salary'),
  jobType: text('job_type').notNull(), // Full-time, Internship, Campus Hiring
  skills: text('skills').array().notNull(),
  experience: text('experience').notNull(),
  description: text('description').notNull(),
  applicationDeadline: timestamp('application_deadline').notNull(),
  companyLogo: text('company_logo'),
  status: text('status').notNull().default('active'), // active, closed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Candidates table (for recruiter functionality)
export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  skills: text('skills').array().notNull(),
  experience: text('experience').notNull(), // e.g., "2 years", "Fresher"
  education: text('education').notNull(),
  resume: text('resume'), // URL to resume file
  portfolio: text('portfolio'), // URL to portfolio
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Applications table (for recruiter functionality)
export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  status: text('status').notNull().default('applied'), // applied, shortlisted, rejected, interview_scheduled, hired
  aiSkillMatchScore: integer('ai_skill_match_score'), // 0-100
  coverLetter: text('cover_letter'),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  interviewScheduled: timestamp('interview_scheduled'),
  interviewNotes: text('interview_notes'),
});

export type CandidateProfileRow = typeof candidateProfiles.$inferSelect;
export type ProfileActivityRow = typeof profileActivity.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
