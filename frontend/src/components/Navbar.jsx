import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Code2, Flame, Bell, Terminal, Sparkles } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0d1322]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="flex items-center space-x-2.5 group transition-transform active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CodeCraft
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 -mt-1">
                Online Judge
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              Problems
            </Link>
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed flex items-center gap-1.5">
              Contests
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">Soon</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed">
              Discuss
            </span>
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Interview Prep
            </span>
          </nav>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>3 Day Streak</span>
          </div>

          <button
            title="Console Logs"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <Terminal className="w-4 h-4" />
          </button>

          <button
            title="Notifications"
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#0d1322]"></span>
          </button>

          <div className="h-6 w-px bg-slate-800 mx-1"></div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner ring-2 ring-slate-800">
              JS
            </div>
            <span className="hidden sm:inline text-xs font-medium text-slate-300">
              Dev User
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
