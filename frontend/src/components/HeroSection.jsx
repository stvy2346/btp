import React from "react";
import { Sparkles, Terminal, CheckCircle2, Zap, Shuffle } from "lucide-react";

export default function HeroSection({ onPickRandom, totalProblems = 50 }) {
  return (
    <div className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-[#0e1628] via-[#0b101e] to-[#0b0f19]">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Algorithmic Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
            Master Data Structures & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Algorithms with Real-time Code Execution
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed">
            Sharpen your problem-solving abilities with our curated set of {totalProblems} core interview problems.
            Write code in the built-in Monaco editor and validate your logic against comprehensive test suites.
          </p>

          {/* Call to Actions & Features */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onPickRandom}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform active:scale-95 cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              Pick Random Problem
            </button>
            <a
              href="#problem-list"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-sm border border-slate-700/60 transition-all hover:border-slate-600 cursor-pointer"
            >
              Browse All {totalProblems} Problems
            </a>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pt-6 w-full max-w-3xl">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">{totalProblems} Problems</div>
                <div className="text-[11px] text-slate-400">Curated & Tagged</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center gap-2.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">Monaco Editor</div>
                <div className="text-[11px] text-slate-400">VS Code Experience</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">4 Languages</div>
                <div className="text-[11px] text-slate-400">C++, Py, JS, Java</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">Interactive Testcases</div>
                <div className="text-[11px] text-slate-400">Console & Verdicts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
