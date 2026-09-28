import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Send,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Layers,
  FileCode2,
  Terminal,
  HelpCircle,
  ListFilter
} from "lucide-react";
import { mockProblems } from "../data/mockProblems";

const LANGUAGE_CONFIG = {
  cpp: { name: "C++ (GCC 14)", monacoLang: "cpp" },
  python: { name: "Python 3", monacoLang: "python" },
  javascript: { name: "JavaScript (ES6)", monacoLang: "javascript" },
  java: { name: "Java (OpenJDK 17)", monacoLang: "java" },
};

// TODO: move to an env var (e.g. import.meta.env.VITE_API_BASE) in a real build
const API_BASE = "http://localhost:4000";

// Shared verdict -> visual treatment. Anything other than "Accepted" renders
// as a red/rose failure state instead of the old always-green mock state.
function getVerdictStyle(status) {
  const isAccepted = status === "Accepted";
  return {
    isAccepted,
    Icon: isAccepted ? CheckCircle2 : XCircle,
    badgeClasses: isAccepted
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-rose-400 bg-rose-500/10 border-rose-500/20",
    textClass: isAccepted ? "text-emerald-400" : "text-rose-400",
  };
}

export default function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problemId = parseInt(id, 10);

  // Find problem from mockProblems or fallback to #1
  const problem = mockProblems.find((p) => p.id === problemId) || mockProblems[0];

  // Language & Code state
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Active tabs
  const [leftTab, setLeftTab] = useState("description"); // description | submissions
  const [testcaseTab, setTestcaseTab] = useState(0); // index of testcase, or 'custom'
  const [customInput, setCustomInput] = useState("");
  const [activeBottomView, setActiveBottomView] = useState("testcases"); // testcases | result

  // Execution states (Run & Submit against the real judge API)
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  // When problem or language changes, set code to the starter template
  useEffect(() => {
    if (problem && problem.starterCodes) {
      setCode(problem.starterCodes[selectedLanguage] || "");
    }
    setRunResult(null);
    setSubmitResult(null);
    setTestcaseTab(0);
    setActiveBottomView("testcases");
  }, [problemId, selectedLanguage]);

  // Handle previous / next problem navigation
  const prevProblem = mockProblems.find((p) => p.id === problemId - 1);
  const nextProblem = mockProblems.find((p) => p.id === problemId + 1);

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset code to initial starter
  const handleResetCode = () => {
    if (problem && problem.starterCodes) {
      setCode(problem.starterCodes[selectedLanguage] || "");
    }
  };

  // Run code against a single testcase via the judge API
  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveBottomView("result");
    setRunResult(null);
    setSubmitResult(null);

    const body =
      testcaseTab === "custom"
        ? { language: selectedLanguage, code, customInput: customInput }
        : { language: selectedLanguage, code, testCaseIndex: testcaseTab };

    try {
      const res = await fetch(`${API_BASE}/api/problems/${problem.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setRunResult({
        status: data.verdict,
        caseNum: data.caseNum,
        input: data.input,
        expectedOutput: data.expectedOutput,
        actualOutput: data.actualOutput ?? data.message,
        runtime: data.run ? `${data.run.timeMs} ms` : "—",
        memory: "—", // the judge enforces a memory cap but doesn't report usage
        stdout: data.run?.stdout ?? "",
        stderr: data.run?.stderr || data.compile?.stderr || "",
      });
    } catch (err) {
      setRunResult({ status: "Internal Error", actualOutput: String(err) });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code for full evaluation via the judge API
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setActiveBottomView("result");
    setRunResult(null);
    setSubmitResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/problems/${problem.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLanguage, code }),
      });
      const data = await res.json();
      setSubmitResult({
        status: data.verdict,
        totalPassed: data.totalPassed,
        totalCases: data.totalCases,
        runtime: data.maxRuntimeMs != null ? `${data.maxRuntimeMs} ms` : "—",
        memory: "—",
        timestamp: new Date(data.timestamp).toLocaleTimeString(),
        firstFailure: data.firstFailure,
      });
    } catch (err) {
      setSubmitResult({ status: "Internal Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Easy
          </span>
        );
      case "Medium":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case "Hard":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Hard
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0e17] text-slate-200 overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-slate-800 bg-[#0d1322] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <ListFilter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Problem List</span>
          </Link>

          <div className="h-4 w-px bg-slate-800"></div>

          {/* Problem Navigation */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => prevProblem && navigate(`/question/${prevProblem.id}`)}
              disabled={!prevProblem}
              className={`p-1.5 rounded-lg border border-slate-800 ${
                prevProblem
                  ? "text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  : "text-slate-600 opacity-40 cursor-not-allowed"
              }`}
              title="Previous Problem"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-medium px-2 text-slate-300">
              #{problem.id}
            </span>
            <button
              onClick={() => nextProblem && navigate(`/question/${nextProblem.id}`)}
              disabled={!nextProblem}
              className={`p-1.5 rounded-lg border border-slate-800 ${
                nextProblem
                  ? "text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  : "text-slate-600 opacity-40 cursor-not-allowed"
              }`}
              title="Next Problem"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-sm font-semibold text-slate-100 hidden sm:block truncate max-w-xs md:max-w-md">
            {problem.title}
          </h2>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Run Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-400 ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Running..." : "Run"}</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Send className={`w-3.5 h-3.5 ${isSubmitting ? "animate-pulse" : ""}`} />
            <span>{isSubmitting ? "Evaluating..." : "Submit"}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Divided into Left (Statement) and Right (Editor + Testcases) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ================= LEFT PORTION (Question Statement & Examples) ================= */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0d1322]/50">
          {/* Left panel header tabs */}
          <div className="flex items-center px-4 h-10 border-b border-slate-800 bg-slate-900/60 shrink-0 gap-4 text-xs font-medium">
            <button
              onClick={() => setLeftTab("description")}
              className={`h-full flex items-center gap-1.5 border-b-2 px-1 transition-colors ${
                leftTab === "description"
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              Description
            </button>
            <button
              onClick={() => setLeftTab("submissions")}
              className={`h-full flex items-center gap-1.5 border-b-2 px-1 transition-colors ${
                leftTab === "submissions"
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Submissions
            </button>
          </div>

          {/* Left panel content container with scroll */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 select-text">
            {leftTab === "description" ? (
              <>
                {/* Problem Title & Meta Badges */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                      {problem.id}. {problem.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {getDifficultyBadge(problem.difficulty)}
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {problem.category}
                    </span>
                    <span className="text-slate-400">
                      Acceptance: <span className="text-slate-300 font-mono">{problem.acceptance}</span>
                    </span>
                  </div>
                </div>

                {/* Problem Statement */}
                <div className="text-sm leading-relaxed text-slate-300 space-y-3 font-normal">
                  {problem.statement.split("\n\n").map((para, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Examples Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs text-slate-400">
                    Examples
                  </h3>
                  {problem.examples &&
                    problem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2.5"
                      >
                        <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                          <span>Example {idx + 1}:</span>
                        </div>
                        <div className="text-xs font-mono bg-[#090d16] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                          <p>
                            <span className="text-slate-400">Input: </span>
                            <span className="text-slate-200">{ex.input}</span>
                          </p>
                          <p>
                            <span className="text-slate-400">Output: </span>
                            <span className="text-emerald-300">{ex.output}</span>
                          </p>
                          {ex.explanation && (
                            <p className="pt-1 text-slate-400 font-sans text-xs">
                              <span className="font-semibold text-slate-300">Explanation: </span>
                              {ex.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Constraints Section */}
                {problem.constraints && (
                  <div className="space-y-2.5 pt-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 font-mono bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              /* Submissions Tab Content */
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-200">Past Submissions</h3>
                {submitResult ? (
                  (() => {
                    const { isAccepted, Icon, badgeClasses, textClass } = getVerdictStyle(
                      submitResult.status
                    );
                    return (
                      <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${badgeClasses}`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold flex items-center gap-1.5 ${textClass}`}>
                            <Icon className="w-4 h-4" /> {submitResult.status}
                          </span>
                          <span className="text-slate-400">{submitResult.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-slate-300">
                          <div>
                            Passed: {submitResult.totalPassed}/{submitResult.totalCases}
                          </div>
                          <div>Runtime: {submitResult.runtime}</div>
                        </div>
                        {!isAccepted && submitResult.firstFailure && (
                          <div className="pt-1 text-slate-400">
                            First failing case: #{submitResult.firstFailure.caseNum ?? "—"}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No submissions recorded yet for this question in this session. Submit your code to test!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PORTION (Upper: Monaco Editor, Bottom: Testcases) ================= */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col overflow-hidden bg-[#0d1322]">
          {/* ---------- UPPER PORTION: Monaco Code Editor ---------- */}
          <div className="flex-1 flex flex-col border-b border-slate-800 min-h-[280px]">
            {/* Editor Toolbar */}
            <div className="h-10 px-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                >
                  {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                    <option key={key} value={key} className="bg-slate-900 text-slate-200">
                      {lang.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 hidden sm:inline">Monaco Editor</span>
              </div>

              {/* Editor controls: Reset, Copy */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleResetCode}
                  title="Reset to starter template"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors border border-transparent hover:border-slate-700 cursor-pointer flex items-center gap-1 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  title="Copy code to clipboard"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors border border-transparent hover:border-slate-700 cursor-pointer flex items-center gap-1 text-xs"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 w-full bg-[#1e1e1e] relative">
              <Editor
                height="100%"
                language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang || "cpp"}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  lineNumbers: "on",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  padding: { top: 10, bottom: 10 },
                  fontFamily: "Fira Code, Consolas, Monaco, monospace",
                  fontLigatures: true,
                }}
              />
            </div>
          </div>

          {/* ---------- BOTTOM PORTION: Testcases & Console ---------- */}
          <div className="h-64 sm:h-72 flex flex-col bg-[#0b0f19] shrink-0">
            {/* Bottom Header Tabs (Testcases vs Result) */}
            <div className="h-9 px-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <button
                  onClick={() => setActiveBottomView("testcases")}
                  className={`h-9 flex items-center gap-1.5 border-b-2 px-1 transition-colors cursor-pointer ${
                    activeBottomView === "testcases"
                      ? "border-emerald-400 text-emerald-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Testcases
                </button>

                <button
                  onClick={() => setActiveBottomView("result")}
                  className={`h-9 flex items-center gap-1.5 border-b-2 px-1 transition-colors cursor-pointer ${
                    activeBottomView === "result"
                      ? "border-emerald-400 text-emerald-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Execution Result
                  {(runResult || submitResult) && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        getVerdictStyle((submitResult || runResult).status).isAccepted
                          ? "bg-emerald-400"
                          : "bg-rose-400"
                      }`}
                    ></span>
                  )}
                </button>
              </div>

              {/* Status hint */}
              <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1">
                <span>Connected to judge API</span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="flex-1 p-3.5 overflow-y-auto">
              {activeBottomView === "testcases" ? (
                /* Testcases View */
                <div className="space-y-3">
                  {/* Testcase Sub-tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {problem.defaultTestCases &&
                      problem.defaultTestCases.map((tc, idx) => (
                        <button
                          key={tc.id}
                          onClick={() => setTestcaseTab(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                            testcaseTab === idx
                              ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}

                    <button
                      onClick={() => setTestcaseTab("custom")}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                        testcaseTab === "custom"
                          ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                      }`}
                    >
                      + Custom
                    </button>
                  </div>

                  {/* Selected Case Content */}
                  {testcaseTab !== "custom" ? (
                    problem.defaultTestCases && problem.defaultTestCases[testcaseTab] ? (
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-semibold block mb-1">Input:</span>
                          <div className="bg-[#090d16] border border-slate-800 rounded-lg p-2.5 font-mono text-slate-200 whitespace-pre-wrap">
                            {problem.defaultTestCases[testcaseTab].input}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block mb-1">Expected Output:</span>
                          <div className="bg-[#090d16] border border-slate-800 rounded-lg p-2.5 font-mono text-emerald-300">
                            {problem.defaultTestCases[testcaseTab].expected}
                          </div>
                        </div>
                      </div>
                    ) : null
                  ) : (
                    /* Custom Testcase input */
                    <div className="space-y-1.5 text-xs">
                      <span className="text-slate-400 font-semibold block">Custom Input:</span>
                      <textarea
                        rows={3}
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter custom input arguments here..."
                        className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-2.5 font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Execution Result View */
                <div className="space-y-3">
                  {isRunning || isSubmitting ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-2 text-slate-400 text-xs">
                      <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {isRunning
                          ? "Executing code against testcase..."
                          : "Sending solution to judge..."}
                      </span>
                    </div>
                  ) : submitResult ? (
                    /* Submit Result Card */
                    (() => {
                      const { isAccepted, Icon, badgeClasses, textClass } = getVerdictStyle(
                        submitResult.status
                      );
                      return (
                        <div className="space-y-3">
                          <div
                            className={`flex items-center gap-2 font-bold text-sm border p-2.5 rounded-xl ${badgeClasses}`}
                          >
                            <Icon className={`w-5 h-5 ${textClass}`} />
                            <span>
                              {submitResult.status}
                              {submitResult.totalCases != null && (
                                <>
                                  {" "}
                                  &bull; {submitResult.totalPassed}/{submitResult.totalCases} Test
                                  Cases Passed
                                </>
                              )}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                              <Clock className="w-4 h-4 text-emerald-400" />
                              <div>
                                <div className="text-slate-400">Runtime</div>
                                <div className="font-mono font-bold text-white">
                                  {submitResult.runtime}
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                              <Cpu className="w-4 h-4 text-cyan-400" />
                              <div>
                                <div className="text-slate-400">Memory</div>
                                <div className="font-mono font-bold text-white">
                                  {submitResult.memory}
                                </div>
                              </div>
                            </div>
                          </div>

                          {!isAccepted && submitResult.firstFailure && (
                            <div className="space-y-2 text-xs">
                              <span className="text-rose-400 font-semibold block">
                                First failing case
                                {submitResult.firstFailure.caseNum != null &&
                                  ` (#${submitResult.firstFailure.caseNum})`}
                                :
                              </span>
                              {submitResult.firstFailure.input != null && (
                                <div>
                                  <span className="text-slate-400 block mb-1">Input:</span>
                                  <div className="bg-[#090d16] border border-slate-800 rounded-lg p-2 font-mono text-slate-200 whitespace-pre-wrap">
                                    {submitResult.firstFailure.input}
                                  </div>
                                </div>
                              )}
                              {submitResult.firstFailure.expectedOutput != null && (
                                <div>
                                  <span className="text-slate-400 block mb-1">Expected:</span>
                                  <div className="bg-[#090d16] border border-slate-800 rounded-lg p-2 font-mono text-slate-300">
                                    {submitResult.firstFailure.expectedOutput}
                                  </div>
                                </div>
                              )}
                              {submitResult.firstFailure.actualOutput != null && (
                                <div>
                                  <span className="text-slate-400 block mb-1">Your Output:</span>
                                  <div className="bg-[#090d16] border border-rose-900/50 rounded-lg p-2 font-mono text-rose-300">
                                    {submitResult.firstFailure.actualOutput}
                                  </div>
                                </div>
                              )}
                              {submitResult.firstFailure.stderr && (
                                <div>
                                  <span className="text-slate-400 block mb-1">Stderr:</span>
                                  <div className="bg-[#090d16] border border-rose-900/50 rounded-lg p-2 font-mono text-rose-300 whitespace-pre-wrap">
                                    {submitResult.firstFailure.stderr}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : runResult ? (
                    /* Run Result Card */
                    (() => {
                      const { Icon, textClass } = getVerdictStyle(runResult.status);
                      return (
                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold flex items-center gap-1.5 ${textClass}`}>
                              <Icon className="w-4 h-4" /> {runResult.status}
                            </span>
                            <span className="text-slate-400 font-mono">
                              Runtime: {runResult.runtime}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-slate-400 block font-medium mb-1">
                                Your Output:
                              </span>
                              <div
                                className={`bg-[#090d16] border rounded-lg p-2 font-mono ${
                                  runResult.status === "Accepted"
                                    ? "border-slate-800 text-emerald-300"
                                    : "border-rose-900/50 text-rose-300"
                                }`}
                              >
                                {runResult.actualOutput}
                              </div>
                            </div>
                            {runResult.expectedOutput != null && (
                              <div>
                                <span className="text-slate-400 block font-medium mb-1">
                                  Expected:
                                </span>
                                <div className="bg-[#090d16] border border-slate-800 rounded-lg p-2 font-mono text-slate-300">
                                  {runResult.expectedOutput}
                                </div>
                              </div>
                            )}
                            {runResult.stderr && (
                              <div>
                                <span className="text-slate-400 block font-medium mb-1">
                                  Stderr:
                                </span>
                                <div className="bg-[#090d16] border border-rose-900/50 rounded-lg p-2 font-mono text-rose-300 whitespace-pre-wrap">
                                  {runResult.stderr}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-500 text-xs">
                      <Terminal className="w-6 h-6 mb-1.5 opacity-50" />
                      <span>Click "Run" or "Submit" to execute your code and see results.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}