export type QuestionType = "mcq" | "msq" | "coding";

export interface ApiQuestion {
  _id: string;
  title: string;
  description: string;
  topic?: string;
  difficulty?: string;
  question_type?: QuestionType;
  marks: number;
  options: string[];
  correct_answer?: string | null;
  correct_answers?: string[];
  explanation?: string | null;
  starter_code?: string | null;
  supported_languages?: string[];
  sample_test_cases?: Array<{ input: string; output: string }>;
  hidden_test_cases?: Array<{ input: string; output: string }>;
}

export interface ApiAssessment {
  _id: string;
  title: string;
  description?: string | null;
  topic: string;
  duration: number;
  total_marks: number;
  passing_marks: number;
  question_ids: string[];
}

export interface StudentAssessment extends Omit<ApiAssessment, "_id" | "question_ids"> {
  assessment_id: string;
  total_questions: number;
  questions: ApiQuestion[];
}

export interface AssessmentSession {
  session_id: string;
  assessment_id: string;
  started_at: string;
  expires_at: string;
  duration: number;
  status: string;
}

export type SubmissionAnswer = string | string[] | { language: string; source_code: string };

export interface SubmissionResult {
  assessment_id: string;
  session_id: string;
  score: number;
  total_marks: number;
  percentage: number;
  correct_count: number;
  wrong_count: number;
  result: "PASS" | "FAIL";
  results: Array<{
    question_id: string;
    question_type: QuestionType;
    marks: number;
    marks_awarded?: number;
    your_answer?: string | string[];
    is_correct: boolean;
    explanation?: string | null;
    passed_testcases?: number;
    failed_testcases?: number;
    percentage?: number;
  }>;
}

export interface StudentDashboard {
  total_attempts: number;
  completed: number;
  average_score: number;
  pass_percentage: number;
}

export interface AdminStudent {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  assessments_taken: number;
  average_score: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary?: string | null;
  description: string;
  requirements: string[];
  skills: string[];
  applicants: number;
  apply_url?: string | null;
}
