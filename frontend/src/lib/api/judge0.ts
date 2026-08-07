import { api } from "@/lib/api/client";

export type LanguageId = "python" | "cpp" | "java" | "c";
export type Judge0LanguageId = LanguageId;

export type Judge0Status = {
  id: number;
  description: string;
};

export type ExecuteCodeResponse = {
  success: boolean;
  stdout: string;
  stderr: string;
  compile_output: string;
  status: Judge0Status;
  time: string | number | null;
  memory: number | null;
  message?: string;
};

export type TestCaseResult = {
  test_case: number;
  passed: boolean;
  expected_output: string;
  actual_output: string;
  execution_time?: string | number | null;
  memory?: number | null;
  status?: string;
};

export type EvaluateResponse = {
  passed: number;
  failed: number;
  total: number;
  percentage: number;
  average_execution_time: number;
  maximum_memory: number;
  details: TestCaseResult[];
  verdict?: string;
  analysis?: string | { summary?: string; explanation?: string; code_quality?: string; suggested_solution?: string };
};

type ExecuteCodeRequest = {
  language: LanguageId;
  source_code: string;
  stdin?: string;
};

type EvaluateSubmissionRequest = {
  language: LanguageId;
  source_code: string;
  test_cases: Array<{ input: string; output: string }>;
};

export function executeCode(body: ExecuteCodeRequest) {
  return api<ExecuteCodeResponse>("/judge0/execute", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function evaluateSubmission(body: EvaluateSubmissionRequest) {
  return api<EvaluateResponse>("/judge0/evaluate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
