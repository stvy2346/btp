import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, CheckCircle2, CircleDashed } from "lucide-react";

export default function ProblemTable({ problems }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(problems.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [problems]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.id.toString() === searchTerm.trim();

      const matchesDifficulty =
        selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;

      const matchesCategory =
        selectedCategory === "All" || problem.category === selectedCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [problems, searchTerm, selectedDifficulty, selectedCategory]);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Easy
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Medium
          </span>
        );
      case "Hard":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Hard
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="problem-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Controls: Search, Difficulty Pill Buttons, Category Dropdown */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems by title, topic, or #id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Difficulty Tabs */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDifficulty === diff
                    ? diff === "Easy"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : diff === "Medium"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : diff === "Hard"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span>
          Showing <span className="font-semibold text-slate-200">{filteredProblems.length}</span> of{" "}
          <span className="font-semibold text-slate-200">{problems.length}</span> questions
        </span>
        {(searchTerm || selectedDifficulty !== "All" || selectedCategory !== "All") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedDifficulty("All");
              setSelectedCategory("All");
            }}
            className="text-emerald-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1322]/80 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 w-16 text-center">Status</th>
                <th className="py-3.5 px-4 w-20">S.No</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Category</th>
                <th className="py-3.5 px-4 w-28">Difficulty</th>
                <th className="py-3.5 px-4 w-28 hidden md:table-cell">Acceptance</th>
                <th className="py-3.5 px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <tr
                      key={problem.id}
                      className={`group transition-colors hover:bg-slate-800/40 ${
                        isEven ? "bg-transparent" : "bg-slate-900/20"
                      }`}
                    >
                      {/* Status indicator */}
                      <td className="py-3.5 px-4 text-center">
                        {problem.id % 7 === 0 ? (
                          <span title="Solved">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          </span>
                        ) : (
                          <span title="Todo">
                            <CircleDashed className="w-4 h-4 text-slate-600 mx-auto group-hover:text-slate-500" />
                          </span>
                        )}
                      </td>

                      {/* S.No */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs font-medium">
                        {problem.id}
                      </td>

                      {/* Title & Link */}
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        <Link
                          to={`/question/${problem.id}`}
                          className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group-hover:translate-x-0.5 duration-150"
                        >
                          <span>{problem.title}</span>
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-normal bg-slate-800/80 text-slate-400 border border-slate-700/50">
                          {problem.category}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-4">{getDifficultyBadge(problem.difficulty)}</td>

                      {/* Acceptance */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs hidden md:table-cell">
                        {problem.acceptance}
                      </td>

                      {/* Action Arrow */}
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to={`/question/${problem.id}`}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                          title={`Solve ${problem.title}`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    No questions found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
