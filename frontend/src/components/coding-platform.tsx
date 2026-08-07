"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  AlertTriangle,
  Info,
  Loader2,
  Send,
  CheckSquare,
  Code2,
  Bookmark,
  Star,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  runRealCode,
  submitToRealJudge0,
  type ExecuteCodeResponse,
  type EvaluateResponse,
  type TestCaseResult,
} from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { ApiQuestion } from "@/lib/api/types";

export type LanguageId = "python" | "cpp" | "java" | "c";

const LANGUAGES: Array<{ value: LanguageId; label: string; extension: string; monacoLang: string }> = [
  { value: "python", label: "Python 3", extension: "py", monacoLang: "python" },
  { value: "cpp", label: "C++", extension: "cpp", monacoLang: "cpp" },
  { value: "java", label: "Java", extension: "java", monacoLang: "java" },
  { value: "c", label: "C", extension: "c", monacoLang: "c" },
];

const DEFAULT_STARTERS: Record<LanguageId, string> = {
  python: `# Write your Python solution here

def solve():
    pass

if __name__ == "__main__":
    solve()
`,
  cpp: `// Write your C++ solution here
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    return 0;
}
`,
  java: `// Write your Java solution here
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

    }
}
`,
  c: `// Write your C solution here
#include <stdio.h>

int main(void) {

    return 0;
}
`,
};

interface SampleTestCaseInput {
  id: number;
  input: string;
  output: string;
  explanation?: string;
}

interface CodingWorkbenchProps {
  problem: ApiQuestion & { number?: number };
  onBack: () => void;
}

type TabKey = "description" | "examples" | "submissions" | "hints";
type OutputTabKey = "testcase" | "stdout" | "result";

const difficultyStyles = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

export function CodingWorkbench({ problem, onBack }: CodingWorkbenchProps) {
  const normalizeDifficulty = (problem.difficulty || "Medium") as "Easy" | "Medium" | "Hard";
  const difficultyLabel =
    normalizeDifficulty.charAt(0).toUpperCase() + normalizeDifficulty.slice(1).toLowerCase();
  const difficulty = ["Easy", "Medium", "Hard"].includes(difficultyLabel as any)
    ? (difficultyLabel as "Easy" | "Medium" | "Hard")
    : "Medium";

  const testCases: SampleTestCaseInput[] = useMemo(() => {
    return (problem.sample_test_cases || []).map((tc, idx) => ({
      id: idx + 1,
      input: tc.input ?? "",
      output: tc.output ?? "",
    }));
  }, [problem]);

  const [activeLeftTab, setActiveLeftTab] = useState<TabKey>("description");
  const [activeOutputTab, setActiveOutputTab] = useState<OutputTabKey>("testcase");

  const [language, setLanguage] = useState<LanguageId>("python");
  const [code, setCode] = useState<string>(() => {
    if (problem.starter_code) return problem.starter_code;
    return DEFAULT_STARTERS.python;
  });

  const [selectedTestCase, setSelectedTestCase] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>(testCases[0]?.input ?? "");
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false);

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [runResult, setRunResult] = useState<ExecuteCodeResponse | null>(null);
  const [evaluateResult, setEvaluateResult] = useState<EvaluateResponse | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [leftWidthPercent, setLeftWidthPercent] = useState(50);
  const resizingRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const monacoLang =
    LANGUAGES.find((l) => l.value === language)?.monacoLang || "plaintext";

  const selectTestCase = (index: number) => {
    setSelectedTestCase(index);
    setActiveOutputTab("testcase");
  };

  const handleLanguageChange = (nextLang: LanguageId) => {
    setLanguage(nextLang);
    if (!problem.starter_code) {
      setCode(DEFAULT_STARTERS[nextLang]);
    }
    setRunResult(null);
    setEvaluateResult(null);
  };

  const resetCode = () => {
    setCode(problem.starter_code ?? DEFAULT_STARTERS[language]);
    setRunResult(null);
    setEvaluateResult(null);
  };

  const handleResizeStart = useCallback(() => {
    resizingRef.current = true;
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(Math.max(percent, 25), 75);
      setLeftWidthPercent(clamped);
    };
    const handleUp = () => {
      resizingRef.current = false;
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const runCode = useCallback(async () => {
    setRunning(true);
    setRunResult(null);
    setEvaluateResult(null);
    setActiveOutputTab("stdout");
    try {
      const input = useCustomInput ? customInput : testCases[selectedTestCase]?.input ?? "";
      const result = await runRealCode(
        language,
        code,
        input,
      );
      setRunResult(result);
    } catch (err) {
      setRunResult({
        success: false,
        stdout: "",
        stderr: err instanceof Error ? err.message : "Failed to run code",
        compile_output: "",
        status: { id: -1, description: "Error" },
        time: null,
        memory: null,
      });
    } finally {
      setRunning(false);
    }
  }, [language, code, customInput, useCustomInput, selectedTestCase, testCases]);

  const submitCode = useCallback(async () => {
    setSubmitting(true);
    setRunResult(null);
    setEvaluateResult(null);
    setSubmissionError(null);
    setActiveOutputTab("result");

    const slug = (problem as any).slug || problem.title.toLowerCase().replace(/\s+/g, '-');
    let rawResult: any = null;
    let attemptedRetry = false;

    const handleFailureResult = (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      setSubmissionError(message);
      setEvaluateResult({
        passed: 0,
        failed: testCases.length,
        total: testCases.length,
        percentage: 0,
        average_execution_time: 0,
        maximum_memory: 0,
        details: testCases.map((tc, idx) => ({
          test_case: idx + 1,
          passed: false,
          expected_output: tc.output,
          actual_output: message,
          status: "Error",
        })),
      });
    };

    try {
      try {
        rawResult = await submitToRealJudge0(slug, language, code) as any;
      } catch (firstError) {
        console.error("Coding submit failed on first attempt", firstError);
        const isNetworkFailure = firstError instanceof ApiError && firstError.status === 0;
        if (isNetworkFailure) {
          attemptedRetry = true;
          console.warn("Retrying coding submit due to network/fetch failure...");
          rawResult = await submitToRealJudge0(slug, language, code) as any;
        } else {
          throw firstError;
        }
      }

      const mappedResult: EvaluateResponse = {
        passed: rawResult.passedTests || 0,
        failed: (rawResult.totalTests || 0) - (rawResult.passedTests || 0),
        total: rawResult.totalTests || 0,
        percentage: rawResult.totalTests > 0 ? Math.round((rawResult.passedTests / rawResult.totalTests) * 100) : 0,
        average_execution_time: (rawResult.runtimeMs || 0) / 1000,
        maximum_memory: rawResult.memoryKb || 0,
        details: rawResult.details || [],
        verdict: rawResult.verdict,
        analysis: rawResult.analysis,
      };

      setEvaluateResult(mappedResult);
      if (attemptedRetry) {
        console.info("Coding submit succeeded after retry");
      }
    } catch (err) {
      console.error("Coding submit failed", err);
      handleFailureResult(err);
    } finally {
      setSubmitting(false);
    }
  }, [code, language, problem, testCases]);

  const handleEditorMount = (ed: editor.IStandaloneCodeEditor) => {
    ed.addCommand([
      (ed as any).KeyMod?.CtrlCmd ?? 2048,
      (ed as any).KeyCode?.Enter ?? 3,
    ] as any, () => runCode());
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[650px] bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-glass">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" onClick={onBack} className="!p-2 h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-brand-orange shrink-0" />
              <h2 className="text-sm font-semibold text-text-primary truncate">
                {problem.number ? `${problem.number}. ` : ""}{problem.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge className={difficultyStyles[difficulty]}>
                {difficulty}
              </Badge>
              {problem.topic && (
                <span className="text-[11px] text-text-muted">{problem.topic}</span>
              )}
            </div>
            {submissionError && (
              <div className="mt-3 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <strong>Submission error:</strong> {submissionError}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 !p-2">
            <Bookmark className="w-4 h-4 text-text-muted" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 !p-2">
            <Star className="w-4 h-4 text-text-muted" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-[var(--left-w)_12px_1fr] flex-1 min-h-0"
        style={
          {
            ["--left-w" as any]: `${leftWidthPercent}%`,
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center gap-1 px-3 pt-2 border-b border-border-subtle">
            {(
              [
                { k: "description", label: "Description", icon: Info },
                { k: "examples", label: "Testcases", icon: CheckSquare },
                { k: "submissions", label: "Submissions", icon: Send },
                { k: "hints", label: "Hints", icon: Lock },
              ] as Array<{ k: TabKey; label: string; icon: any }>
            ).map((tab) => (
              <button
                key={tab.k}
                onClick={() => setActiveLeftTab(tab.k)}
                className={cn(
                  "px-3 py-2 text-xs font-medium rounded-t-md flex items-center gap-1.5 transition-colors",
                  activeLeftTab === tab.k
                    ? "bg-brand-orange/10 text-brand-orange border border-b-0 border-brand-orange/20"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-5 text-text-primary text-[13.5px] leading-relaxed">
            {activeLeftTab === "description" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <section>
                  <h3 className="text-base font-semibold mb-2">Problem Description</h3>
                  <pre className="whitespace-pre-wrap font-sans text-[13.5px] text-text-primary/90">
                    {problem.description || "No description provided."}
                  </pre>
                </section>
                <section>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Marks</h4>
                  <p className="text-sm text-text-muted">{problem.marks} marks</p>
                </section>
                {problem.supported_languages && problem.supported_languages.length > 0 && (
                  <section>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Supported Languages</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {problem.supported_languages.map((l) => (
                        <Badge key={l} variant="secondary">{l}</Badge>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {activeLeftTab === "examples" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-base font-semibold mb-2">Sample Test Cases</h3>
                {testCases.map((tc, idx) => (
                  <Card key={tc.id} className={cn(
                    "!p-4 transition-colors",
                    selectedTestCase === idx && "border-brand-orange/30 bg-brand-orange/5"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => {
                          selectTestCase(idx);
                          setCustomInput(tc.input);
                          setUseCustomInput(false);
                        }}
                        className="text-xs font-semibold text-text-primary hover:text-brand-orange"
                      >
                        Example {idx + 1}
                      </button>
                      {selectedTestCase === idx && (
                        <Badge className="!text-[10px]" variant="secondary">Selected</Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Input</p>
                        <pre className="text-xs font-mono bg-white/5 border border-border-subtle rounded-lg p-2.5 overflow-x-auto text-text-primary">
                          {tc.input || "(empty)"}
                        </pre>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Output</p>
                        <pre className="text-xs font-mono bg-white/5 border border-border-subtle rounded-lg p-2.5 overflow-x-auto text-emerald-400">
                          {tc.output || "(empty)"}
                        </pre>
                      </div>
                      {tc.explanation && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Explanation</p>
                          <p className="text-xs text-text-primary/80">{tc.explanation}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeLeftTab === "submissions" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <Code2 className="w-10 h-10 text-text-muted mb-3" />
                  <h4 className="text-sm font-semibold text-text-primary mb-1">No recent submissions</h4>
                  <p className="text-xs text-text-muted max-w-xs">
                    Run or submit your code to see your submissions history here.
                  </p>
                </div>
              </motion.div>
            )}

            {activeLeftTab === "hints" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex flex-col items-center justify-center text-center py-16 gap-2">
                  <Lock className="w-9 h-9 text-text-muted" />
                  <h4 className="text-sm font-semibold text-text-primary">Hints locked</h4>
                  <p className="text-xs text-text-muted max-w-xs">
                    Premium feature — unlock AI hints and detailed explanations.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center group cursor-col-resize hover:bg-brand-orange/10 transition-colors bg-border-subtle/50">
          <GripVertical
            onMouseDown={handleResizeStart}
            className="w-4 h-4 text-text-muted group-hover:text-brand-orange"
          />
        </div>

        <div className="flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-glass">
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
                  className="appearance-none bg-white/5 border border-border-subtle rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-text-primary focus:outline-none focus:border-brand-orange/40 cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="w-3.5 h-3.5 text-text-muted absolute right-1.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
              <Button variant="ghost" size="sm" onClick={resetCode} className="h-8 gap-1 !px-2 text-text-muted hover:text-text-primary">
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">Reset</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={runCode}
                disabled={running || submitting}
                className="h-8 gap-1.5"
              >
                {running ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="text-[12px]">Run</span>
              </Button>
              <Button
                size="sm"
                onClick={submitCode}
                disabled={running || submitting}
                className="h-8 gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span className="text-[12px]">Submit</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative bg-[#0b1020]/40">
            <Editor
              height="100%"
              theme="vs-dark"
              language={monacoLang}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              onMount={handleEditorMount}
              options={{
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                padding: { top: 14, bottom: 14 },
                bracketPairColorization: { enabled: true },
                renderLineHighlight: "all",
                lineNumbersMinChars: 3,
              }}
              loading={
                <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading editor...
                </div>
              }
            />
          </div>

          <div className="flex flex-col border-t border-border-subtle bg-glass/70 h-[45%] min-h-[240px] max-h-[45%]">
            <div className="flex items-center gap-1 px-3 pt-2 border-b border-border-subtle/70">
              {(
                [
                  { k: "testcase", label: "Testcase", icon: CheckSquare },
                  { k: "stdout", label: "Stdout", icon: Code2 },
                  { k: "result", label: "Result", icon: evaluateResult ? (evaluateResult.passed === evaluateResult.total ? CheckCircle2 : XCircle) : AlertTriangle },
                ] as Array<{ k: OutputTabKey; label: string; icon: any }>
              ).map((tab) => (
                <button
                  key={tab.k}
                  onClick={() => setActiveOutputTab(tab.k)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-t-md flex items-center gap-1.5 transition-colors",
                    activeOutputTab === tab.k
                      ? "bg-white/5 text-brand-orange border border-b-0 border-border-subtle"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.k === "result" && evaluateResult && (
                    <Badge className={cn(
                      "!text-[10px] !px-1.5 !py-0 ml-1",
                      evaluateResult.passed === evaluateResult.total
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                      {evaluateResult.percentage}%
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeOutputTab === "testcase" && (
                <div className="space-y-3">
                  {testCases.length > 0 ? (
                    <>
                      <div className="flex gap-2">
                        {testCases.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectTestCase(idx)}
                            className={cn(
                              "h-7 min-w-[52px] px-3 rounded-md text-xs font-medium transition-colors",
                              selectedTestCase === idx
                                ? "bg-brand-orange/15 text-brand-orange border border-brand-orange/30"
                                : "bg-white/5 text-text-muted border border-border-subtle hover:text-text-primary"
                            )}
                          >
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>

                      <label className="flex items-center gap-2 text-xs text-text-muted select-none">
                        <input
                          type="checkbox"
                          checked={useCustomInput}
                          onChange={(e) => setUseCustomInput(e.target.checked)}
                          className="accent-brand-orange"
                        />
                        Use custom input
                      </label>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1.5">Input</p>
                        <textarea
                          value={useCustomInput ? customInput : testCases[selectedTestCase]?.input ?? ""}
                          onChange={(e) => setCustomInput(e.target.value)}
                          disabled={!useCustomInput}
                          spellCheck={false}
                          rows={6}
                          className="w-full font-mono text-xs bg-white/5 border border-border-subtle rounded-lg p-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-orange/30 disabled:opacity-70 resize-none"
                          placeholder="Enter custom input..."
                        />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1.5">Expected Output</p>
                        <pre className="font-mono text-xs bg-white/5 border border-border-subtle rounded-lg p-2.5 text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                          {testCases[selectedTestCase]?.output ?? "(empty)"}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-border-subtle bg-white/5 p-4 text-sm text-text-muted">
                      No sample test cases are available for this problem.
                    </div>
                  )}
                </div>
              )}

              {activeOutputTab === "stdout" && (
                <div className="h-full flex flex-col gap-2">
                  {!runResult && !running && (
                    <div className="m-auto text-center py-10">
                      <Play className="w-8 h-8 text-text-muted mx-auto mb-2" />
                      <p className="text-xs text-text-muted">Click <span className="text-brand-orange">Run</span> to execute your code.</p>
                    </div>
                  )}
                  {running && (
                    <div className="m-auto flex items-center gap-2 text-brand-orange text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Running...
                    </div>
                  )}
                  {runResult && (
                    <>
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{runResult.time ?? "—"}s</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5" />
                          <span>{runResult.memory ?? "—"} KB</span>
                        </div>
                        <Badge className="!text-[10px]" variant="secondary">
                          {runResult.status?.description ?? "Unknown"}
                        </Badge>
                      </div>
                      {runResult.stdout && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-emerald-400/90 mb-1.5">stdout</p>
                          <pre className="font-mono text-xs bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2.5 text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                            {runResult.stdout}
                          </pre>
                        </div>
                      )}
                      {runResult.stderr && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-red-400/90 mb-1.5">stderr</p>
                          <pre className="font-mono text-xs bg-red-500/5 border border-red-500/10 rounded-lg p-2.5 text-red-300 whitespace-pre-wrap overflow-x-auto">
                            {runResult.stderr}
                          </pre>
                        </div>
                      )}
                      {runResult.compile_output && (
                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-amber-400/90 mb-1.5">compile</p>
                          <pre className="font-mono text-xs bg-amber-500/5 border border-amber-500/10 rounded-lg p-2.5 text-amber-300 whitespace-pre-wrap overflow-x-auto">
                            {runResult.compile_output}
                          </pre>
                        </div>
                      )}
                      {!runResult.stdout && !runResult.stderr && !runResult.compile_output && (
                        <div className="text-center text-text-muted text-xs py-6">
                          No output produced.
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeOutputTab === "result" && (
                <div className="h-full flex flex-col gap-3">
                  {!evaluateResult && !submitting && (
                    <div className="m-auto text-center py-10">
                      <Send className="w-8 h-8 text-text-muted mx-auto mb-2" />
                      <p className="text-xs text-text-muted">Click <span className="text-emerald-400">Submit</span> to run all test cases.</p>
                    </div>
                  )}
                  {submitting && (
                    <div className="m-auto flex items-center gap-2 text-brand-orange text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Evaluating all test cases...
                    </div>
                  )}
                  {evaluateResult && <ResultPanel result={evaluateResult} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultPanel({ result }: { result: EvaluateResponse }) {
  const allPassed = result.passed === result.total;
  return (
    <div className="space-y-3">
      <div className={cn(
        "p-4 rounded-xl border",
        allPassed
          ? "bg-emerald-500/10 border-emerald-500/20"
          : "bg-red-500/10 border-red-500/20"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            allPassed ? "bg-emerald-500/20" : "bg-red-500/20"
          )}>
            {allPassed ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className={cn("font-semibold", allPassed ? "text-emerald-400" : "text-red-400")}>
              {allPassed ? "Accepted" : `Wrong Answer — ${result.percentage}% Passed`}
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-text-muted mt-1">
              <span>{result.passed} / {result.total} test cases passed</span>
              <span>Avg time: {result.average_execution_time}s</span>
              <span>Peak memory: {result.maximum_memory} KB</span>
            </div>
          </div>
        </div>
      </div>

      {result.analysis && (
        <div className="rounded-xl border border-border-subtle bg-white/[0.03] p-4 space-y-3">
          <h4 className="text-sm font-semibold text-text-primary">AI Analysis</h4>
          {typeof result.analysis === "string" ? (
            <pre className="whitespace-pre-wrap text-xs text-text-primary/90">{result.analysis}</pre>
          ) : (
            <>
              {result.analysis.summary && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Summary</p>
                  <pre className="whitespace-pre-wrap text-xs text-text-primary/90">{result.analysis.summary}</pre>
                </div>
              )}
              {result.analysis.explanation && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Explanation</p>
                  <pre className="whitespace-pre-wrap text-xs text-text-primary/90">{result.analysis.explanation}</pre>
                </div>
              )}
              {result.analysis.code_quality && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Code Quality</p>
                  <pre className="whitespace-pre-wrap text-xs text-text-primary/90">{result.analysis.code_quality}</pre>
                </div>
              )}
              {result.analysis.suggested_solution && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Suggested Solution</p>
                  <pre className="whitespace-pre-wrap text-xs text-text-primary/90">{result.analysis.suggested_solution}</pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <div className="space-y-2">
        {result.details.map((d: TestCaseResult) => (
          <details key={d.test_case} className="rounded-xl border border-border-subtle bg-white/[0.03] overflow-hidden" open={!d.passed}>
            <summary className="flex items-center justify-between px-3 py-2.5 cursor-pointer list-none">
              <div className="flex items-center gap-2.5">
                {d.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="text-xs font-medium text-text-primary">Test Case {d.test_case}</span>
                {d.status && (
                  <Badge variant="secondary" className="!text-[10px]">{d.status}</Badge>
                )}
              </div>
              {(d.execution_time || d.memory) && (
                <div className="flex gap-3 text-[11px] text-text-muted">
                  {d.execution_time && <span>{d.execution_time}s</span>}
                  {d.memory && <span>{d.memory} KB</span>}
                </div>
              )}
            </summary>
            <div className="border-t border-border-subtle p-3 space-y-2 bg-black/20">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text-muted mb-1">Expected</p>
                <pre className="font-mono text-xs bg-white/5 border border-border-subtle rounded-lg p-2.5 text-emerald-400 whitespace-pre-wrap overflow-x-auto">
                  {d.expected_output || "(empty)"}
                </pre>
              </div>
              <div>
                <p className={cn(
                  "text-[11px] uppercase tracking-wide mb-1",
                  d.passed ? "text-emerald-400/90" : "text-red-400/90"
                )}>
                  {d.passed ? "Your Output" : "Actual Output"}
                </p>
                <pre className={cn(
                  "font-mono text-xs border rounded-lg p-2.5 whitespace-pre-wrap overflow-x-auto",
                  d.passed
                    ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-300"
                    : "bg-red-500/5 border-red-500/10 text-red-300"
                )}>
                  {d.actual_output || "(empty)"}
                </pre>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
