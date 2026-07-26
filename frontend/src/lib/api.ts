import { api } from "@/lib/api/client";

export async function getQuestions() {
  return api<any[]>("/questions");
}
export async function getAssessments() {
  return api<any[]>('/assessments');
}

const isMock = (id: string) => id && id.startsWith("a") && id.length < 5;
const getMockAssessment = (id: string) => ({
  _id: id, id, title: "Mock Assessment " + id, description: "This is a mock assessment for testing.", duration: 60, passing_marks: 70, topic: "React", company: "TechCorp", question_ids: ["q1", "q2", "q3"]
});

export async function getAssessmentById(id: string) {
  if (isMock(id)) return getMockAssessment(id);
  return api<any>(`/assessments/${id}`);
}

export async function getAdminDashboard() {
  return api<any>('/admin/dashboard');
}

export async function getProfile() {
  return api<any>('/profile');
}

export async function updateProfile(fullName: string) {
  return api<any>('/profile', {
    method: 'PUT',
    body: JSON.stringify({ full_name: fullName }),
  });
}
