import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProblemTable from "../components/ProblemTable";
import { mockProblems } from "../data/mockProblems";

export default function HomePage() {
  const navigate = useNavigate();

  const handlePickRandom = () => {
    const randomIndex = Math.floor(Math.random() * mockProblems.length);
    const randomProblem = mockProblems[randomIndex];
    if (randomProblem) {
      navigate(`/question/${randomProblem.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection onPickRandom={handlePickRandom} totalProblems={mockProblems.length} />
        <ProblemTable problems={mockProblems} />
      </main>
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CodeCraft Online Judge &bull; Frontend Workspace</span>
          <span>Placeholder data for backend server integration</span>
        </div>
      </footer>
    </div>
  );
}
