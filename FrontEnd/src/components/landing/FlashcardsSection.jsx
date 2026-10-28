import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  X,
  RotateCcw,
  Check,
  ChevronRight,
  Eye
} from 'lucide-react';

export const FlashcardsSection = () => {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const cards = [
    {
      question: "What is the time complexity of Dijkstra's algorithm using a priority queue?",
      answer: "O((V + E) log V)",
      explanation: "Using a binary min-heap or priority queue allows finding the minimum distance vertex in O(log V) time and updating each edge in O(log V) time."
    },
    {
      question: "Can Dijkstra's algorithm handle graphs with negative edge weights?",
      answer: "No, Dijkstra's cannot handle negative edge weights.",
      explanation: "Dijkstra's greedy assumption fails when negative weights exist. Use the Bellman-Ford algorithm instead for negative edge weights."
    },
    {
      question: "What data structure is used to implement Prim's Minimum Spanning Tree?",
      answer: "Priority Queue (Min-Heap)",
      explanation: "Prim's algorithm uses a priority queue to select the minimum weight edge connecting the cut at each step in O(E log V) time."
    }
  ];

  const currentCard = cards[currentIdx];

  const handleNext = () => {
    setIsAnswerRevealed(false);
    setCurrentIdx((prev) => (prev + 1) % cards.length);
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F0] dark:bg-[#16171C] border-y border-[#ECE7DC] dark:border-[#252731] select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text & Bullet Points */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/70 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>LEARN AND REMEMBER</span>
            </div>

            <h3 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1E1E1E] dark:text-[#FAF8F5] leading-tight">
              Turn notes into long-term knowledge
            </h3>

            <p className="text-sm text-[#6E6C66] dark:text-[#A8A59E] leading-relaxed">
              Convert your notes into flashcards, quizzes and revision plans. Use spaced repetition to remember what matters.
            </p>

            <div className="space-y-3 pt-1">
              {[
                'One-click flashcard generation',
                'Multiple question types (MCQs, short answer, fill in the blanks)',
                'Spaced repetition with smart scheduling',
                'Track your progress and weak topics',
                'Perfect for exams, interviews and continuous learning'
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-3 text-xs sm:text-sm text-[#44423E] dark:text-[#D1CEC7]">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Handwritten Note */}
            <div className="pt-2 pl-6">
              <span className="font-serif italic text-sm text-orange-600 dark:text-orange-400 flex items-center space-x-2">
                <span>⤷</span>
                <span>Study smarter, not harder!</span>
              </span>
            </div>
          </div>

          {/* Right: Flashcards Interactive Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E7E2D6] dark:border-[#2B2D38] bg-white dark:bg-[#181A20] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
              
              {/* Flashcard Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0] dark:border-[#23252E]">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-serif font-bold text-xs text-[#222] dark:text-[#FAF8F5]">
                    Flashcards
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs text-[#88857E] dark:text-[#7A7C85]">
                    {currentIdx + 1} / {cards.length}
                  </span>
                  <button className="text-[#999] hover:text-[#555] dark:hover:text-[#DDD]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#EFECE5] dark:bg-[#252833] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / cards.length) * 100}%` }}
                />
              </div>

              {/* Question & Answer Area */}
              <div className="min-h-[170px] flex flex-col justify-center items-center text-center p-4 rounded-2xl bg-[#FAF8F3] dark:bg-[#1C1E26] border border-[#ECE7DC] dark:border-[#272935] space-y-4">
                <p className="font-serif font-bold text-base sm:text-lg text-[#1F1F1F] dark:text-[#F8F6F2] leading-snug max-w-lg">
                  {currentCard.question}
                </p>

                {!isAnswerRevealed ? (
                  <button
                    onClick={() => setIsAnswerRevealed(true)}
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#252833] border border-[#DDD8CE] dark:border-[#333745] hover:border-orange-400 text-xs font-semibold text-[#555] dark:text-[#CCC] shadow-xs flex items-center space-x-2 transition-all hover:scale-105"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-500" />
                    <span>Click to reveal answer</span>
                  </button>
                ) : (
                  <div className="space-y-2 pt-2 animate-fadeIn">
                    <div className="inline-block px-4 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-sm">
                      {currentCard.answer}
                    </div>
                    <p className="text-xs text-[#66645E] dark:text-[#9A9893] max-w-md mx-auto leading-relaxed">
                      {currentCard.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Spaced Repetition Rating Buttons */}
              <div className="grid grid-cols-4 gap-2.5 pt-1">
                <button
                  onClick={handleNext}
                  className="py-2.5 rounded-xl font-semibold text-xs bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 border border-red-200/60 dark:border-red-900/40 transition-colors shadow-xs"
                >
                  Again
                </button>
                <button
                  onClick={handleNext}
                  className="py-2.5 rounded-xl font-semibold text-xs bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 transition-colors shadow-xs"
                >
                  Hard
                </button>
                <button
                  onClick={handleNext}
                  className="py-2.5 rounded-xl font-semibold text-xs bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40 transition-colors shadow-xs"
                >
                  Good
                </button>
                <button
                  onClick={handleNext}
                  className="py-2.5 rounded-xl font-semibold text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 transition-colors shadow-xs"
                >
                  Easy
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
