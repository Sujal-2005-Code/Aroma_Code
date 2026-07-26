import { api } from "@/lib/api/client";
import type { ApiAssessment, AssessmentSession, StudentAssessment, SubmissionAnswer, SubmissionResult } from "@/lib/api/types";

const isMock = (id: string) => id && id.startsWith("a") && id.length < 5;

const getMockAssessment = (id: string) => ({
  _id: id, id, title: "Mock Assessment " + id, description: "This is a mock assessment for testing.", duration: 60, passing_marks: 70, topic: "React", company: "TechCorp", question_ids: ["q1", "q2", "q3"]
});

const getMockStudentAssessment = (id: string): StudentAssessment => ({
  _id: id, title: "Mock Assessment " + id, duration: 60, questions: [
    { _id: "q1", title: "What is React?", description: "What is React and how does it work?", question_type: "mcq", marks: 5, options: ["A library", "A framework", "A database", "A language"], starter_code: "", supported_languages: [] },
    { _id: "q2", title: "Write a function", description: "Write a function that returns true", question_type: "coding", marks: 10, options: [], supported_languages: ["javascript", "python"], starter_code: "function main() {\n  \n}" }
  ]
});

export const getAssessments = () => api<ApiAssessment[]>("/assessments");
export const getAssessment = (id: string) => isMock(id) ? Promise.resolve(getMockAssessment(id) as any) : api<ApiAssessment>(`/assessments/${id}`);
export const getStudentAssessment = (id: string) => isMock(id) ? Promise.resolve(getMockStudentAssessment(id)) : api<StudentAssessment>(`/student/assessment/${id}`);
export const startAssessment = (assessmentId: string) => isMock(assessmentId) ? Promise.resolve({ session_id: "mock-session", assessment_id: assessmentId, student_id: "mock-student", started_at: new Date().toISOString(), expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), status: "active" } as AssessmentSession) : api<AssessmentSession>("/student/assessment/start", { method: "POST", body: JSON.stringify({ assessment_id: assessmentId }) });
export const getSavedAnswers = (assessmentId: string) => isMock(assessmentId) ? Promise.resolve({ assessment_id: assessmentId, answers: {} }) : api<{ assessment_id: string; answers: Record<string, SubmissionAnswer> }>(`/student/autosave/${assessmentId}`);
export const autosaveAnswer = (assessmentId: string, questionId: string, answer: SubmissionAnswer) => isMock(assessmentId) ? Promise.resolve({ message: "Saved (mock)" }) : api<{ message: string }>("/student/autosave", { method: "POST", body: JSON.stringify({ assessment_id: assessmentId, question_id: questionId, answer }) });
export const submitAssessment = (data: { student_id?: string; assessment_id: string; session_id: string; answers: Record<string, SubmissionAnswer> }) => isMock(data.assessment_id) ? Promise.resolve({ submission_id: "mock-sub", assessment_id: data.assessment_id, student_id: "mock", total_score: 80, result: "PASS", submitted_at: new Date().toISOString() } as SubmissionResult) : api<SubmissionResult>("/submissions", { method: "POST", body: JSON.stringify(data) });
export const getAssessmentResult = (assessmentId: string) => isMock(assessmentId) ? Promise.resolve({ submission_id: "mock-sub", assessment_id: assessmentId, student_id: "mock", total_score: 80, result: "PASS", submitted_at: new Date().toISOString() } as SubmissionResult) : api<SubmissionResult>(`/student/result/${assessmentId}`);
export const createAssessment = (data: Omit<ApiAssessment, "_id">) => api<{ id: string; message: string }>("/assessments", { method: "POST", body: JSON.stringify(data) });
export const updateAssessment = (id: string, data: Omit<ApiAssessment, "_id">) => api<{ message: string }>(`/assessments/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteAssessment = (id: string) => api<{ message: string }>(`/assessments/${id}`, { method: "DELETE" });
