import { api } from "@/lib/api/client";
import type { ApiQuestion } from "@/lib/api/types";


export const getQuestions = () => api<ApiQuestion[]>("/questions");
export const getStudentQuestions = () => api<ApiQuestion[]>("/student/questions");


export const createQuestion = (data: Omit<ApiQuestion, "_id">) => api<{ id: string; message: string }>("/questions", { method: "POST", body: JSON.stringify(data) });
export const updateQuestion = (id: string, data: Omit<ApiQuestion, "_id">) => api<{ message: string }>(`/questions/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteQuestion = (id: string) => api<{ message: string }>(`/questions/${id}`, { method: "DELETE" });
