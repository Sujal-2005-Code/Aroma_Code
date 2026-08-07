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

const STATUS = {
  ACCEPTED: { id: 3, description: "Accepted" },
  WRONG_ANSWER: { id: 4, description: "Wrong Answer" },
  COMPILATION_ERROR: { id: 6, description: "Compilation Error" },
  RUNTIME_ERROR: { id: 9, description: "Runtime Error (NZEC)" },
  TIME_LIMIT: { id: 5, description: "Time Limit Exceeded" },
};

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

function attemptCompile(source: string, language: LanguageId): string | null {
  if (language === "cpp" || language === "c") {
    const opens = (source.match(/\{/g) || []).length;
    const closes = (source.match(/\}/g) || []).length;
    const semicolons = (source.match(/;/g) || []).length;
    if (opens !== closes) return `error: expected '}' before end of input (${opens} '{' vs ${closes} '}')`;
    if (language === "cpp" && !/#include\s*<[a-z/]+\.[a-z]+>/i.test(source) && semicolons > 0) {
      return "warning: no headers included; assuming standard library...\n";
    }
  }
  if (language === "java") {
    const opens = (source.match(/\{/g) || []).length;
    const closes = (source.match(/\}/g) || []).length;
    if (opens !== closes) return `error: '}' expected (reached end of file while parsing)`;
    if (!/public\s+class\s+\w+/.test(source)) return "error: at least one public class must be declared";
  }
  return null;
}

function simulateRuntime(source: string, language: LanguageId, stdin: string): {
  stdout: string; stderr: string; time_ms: number; memory_kb: number; ok: boolean;
} {
  const time_ms = 40 + Math.floor(Math.random() * 260);
  const memory_kb = 3500 + Math.floor(Math.random() * 8000);

  // Syntax / runtime errors first
  if (language === "python") {
    if (/^\s+/.test(source)) {
      return { stdout: "", stderr: "IndentationError: unexpected indent at line 1", time_ms: 30, memory_kb: 2100, ok: false };
    }
  }

  if (source.includes("TLE") || source.includes("time.limit") || source.includes("sleep(")) {
    return { stdout: "", stderr: "", time_ms: 3000, memory_kb, ok: false };
  }

  if (language === "python") {
    // Try to extract a print output based on pattern
    const printMatches = Array.from(source.matchAll(/print\s*\(\s*([^)]*)\s*\)/g));
    if (printMatches.length > 0) {
      const lines = printMatches.map(m => {
        const arg = m[1].trim();
        if (/^["'`].*["'`]$/.test(arg)) return arg.slice(1, -1);
        if (!isNaN(Number(arg))) return String(Number(arg));
        if (stdin && (arg === "input()" || arg === "input")) return stdin.split("\n")[0] || "";
        return `[eval: ${arg}]`;
      });
      return { stdout: lines.join("\n") + "\n", stderr: "", time_ms, memory_kb, ok: true };
    }
  }

  if (language === "cpp" || language === "c") {
    const coutMatches = Array.from(source.matchAll(/cout\s*<<\s*([^;]+);/g));
    const printfMatches = Array.from(source.matchAll(/printf\s*\(\s*"([^"]*)"[^)]*\)\s*;/g));
    const out: string[] = [];
    coutMatches.forEach(m => {
      const content = m[1].replace(/\s*<<\s*endl/g, "").trim();
      if (/^".*"$/.test(content)) out.push(content.slice(1, -1));
      else if (content.includes("endl")) { }
      else out.push(content);
    });
    printfMatches.forEach(m => {
      let s = m[1];
      s = s.replace(/%[dfs]/g, (t: string) => t === "%d" ? "42" : t === "%f" ? "3.14" : "ok");
      out.push(s);
    });
    if (out.length > 0) return { stdout: out.join("\n") + "\n", stderr: "", time_ms, memory_kb, ok: true };
  }

  if (language === "java") {
    const matches = Array.from(source.matchAll(/System\.out\.println\s*\(\s*([^)]*)\s*\)/g));
    const out: string[] = [];
    matches.forEach(m => {
      const arg = m[1].trim();
      if (/^".*"$/.test(arg)) out.push(arg.slice(1, -1));
      else out.push(arg);
    });
    if (out.length > 0) return { stdout: out.join("\n") + "\n", stderr: "", time_ms, memory_kb, ok: true };
  }

  // Generic output if no print found
  if (stdin) {
    return {
      stdout: "Mock: echo stdin → " + stdin.trim().split("\n")[0] + "\n",
      stderr: "",
      time_ms, memory_kb, ok: true,
    };
  }
  return {
    stdout: language === "python" ? "" : language === "java" ? "" : "",
    stderr: "",
    time_ms, memory_kb, ok: true,
  };
}

export async function executeCode(body: {
  language: LanguageId;
  source_code: string;
  stdin?: string;
}): Promise<ExecuteCodeResponse> {
  const networkLatency = 450 + Math.random() * 350;
  await sleep(networkLatency);

  const compilation = attemptCompile(body.source_code, body.language);
  if (compilation && /error:/.test(compilation)) {
    return {
      success: false,
      stdout: "",
      stderr: "",
      compile_output: compilation,
      status: STATUS.COMPILATION_ERROR,
      time: null,
      memory: null,
      message: "Compilation failed",
    };
  }

  const runtime = simulateRuntime(body.source_code, body.language, body.stdin || "");
  if (runtime.time_ms > 2500) {
    return {
      success: false,
      stdout: "",
      stderr: "CPU time limit exceeded (2.5s)",
      compile_output: compilation || "",
      status: STATUS.TIME_LIMIT,
      time: "2.500",
      memory: runtime.memory_kb,
    };
  }

  return {
    success: runtime.ok,
    stdout: runtime.stdout,
    stderr: runtime.stderr,
    compile_output: compilation || "",
    status: runtime.ok ? STATUS.ACCEPTED : STATUS.RUNTIME_ERROR,
    time: (runtime.time_ms / 1000).toFixed(3),
    memory: runtime.memory_kb,
  };
}

export async function evaluateSubmission(body: {
  language: LanguageId;
  source_code: string;
  test_cases: Array<{ input: string; output: string }>;
}): Promise<EvaluateResponse> {
  const latencyPerCase = 260 + Math.random() * 220;
  await sleep(latencyPerCase * Math.min(body.test_cases.length, 4));

  const compileErr = attemptCompile(body.source_code, body.language);
  if (compileErr && /error:/.test(compileErr)) {
    const details: TestCaseResult[] = body.test_cases.map((tc, i) => ({
      test_case: i + 1,
      passed: false,
      expected_output: tc.output,
      actual_output: "",
      status: "Compilation Error",
      execution_time: null,
      memory: null,
    }));
    return {
      passed: 0,
      failed: body.test_cases.length,
      total: body.test_cases.length,
      percentage: 0,
      average_execution_time: 0,
      maximum_memory: 0,
      details,
    };
  }

  let totalTime = 0;
  let maxMem = 0;
  const details: TestCaseResult[] = [];

  for (let i = 0; i < body.test_cases.length; i++) {
    const tc = body.test_cases[i];
    const runtime = simulateRuntime(body.source_code, body.language, tc.input);
    totalTime += runtime.time_ms;
    maxMem = Math.max(maxMem, runtime.memory_kb);
    const actual = runtime.stdout.trim();
    const expected = tc.output.trim();
    const passed = actual === expected;
    details.push({
      test_case: i + 1,
      passed,
      expected_output: tc.output,
      actual_output: runtime.stdout,
      execution_time: (runtime.time_ms / 1000).toFixed(3),
      memory: runtime.memory_kb,
      status: passed ? STATUS.ACCEPTED.description : (
        runtime.time_ms > 2500 ? STATUS.TIME_LIMIT.description : STATUS.WRONG_ANSWER.description
      ),
    });
  }

  const passed = details.filter(d => d.passed).length;
  const total = details.length;
  return {
    passed,
    failed: total - passed,
    total,
    percentage: Math.round((passed / total) * 10000) / 100,
    average_execution_time: Math.round((totalTime / total) * 1000) / 1000,
    maximum_memory: maxMem,
    details,
  };
}
