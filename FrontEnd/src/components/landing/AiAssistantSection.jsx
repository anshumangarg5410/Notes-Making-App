import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  Send,
  Bot,
  Layers,
  ArrowRight
} from 'lucide-react';
import aiBot from '../../assets/shared/ai-bot.png';

export const AiAssistantSection = () => {
  const [question, setQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState(null);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setCustomAnswer(`Based on your notes, "${question.trim()}" is referenced in 3 documents. Key takeaway: review Dijkstra's algorithm and priority queues for optimal performance.`);
    setQuestion('');
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F0] dark:bg-[#16171C] border-y border-[#ECE7DC] dark:border-[#252731] select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text & Checkpoints */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/70 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>AI INSIDE YOUR NOTES</span>
            </div>

            <h3 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1E1E1E] dark:text-[#FAF8F5] leading-tight">
              Your personal AI knowledge assistant
            </h3>

            <p className="text-sm text-[#6E6C66] dark:text-[#A8A59E] leading-relaxed">
              Ask questions, get summaries, generate quizzes and discover insights — all grounded in your own notes.
            </p>

            <div className="space-y-3 pt-1">
              {[
                'Ask anything about your notes',
                'Get accurate answers with source links',
                'Summarize long notes in seconds',
                'Generate flashcards and practice tests',
                'Find related notes automatically'
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
                <span>Answers from your notes, not the internet!</span>
              </span>
            </div>
          </div>

          {/* Right: AI Assistant Mockup Window */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E7E2D6] dark:border-[#2B2D38] bg-white dark:bg-[#181A20] shadow-xl overflow-hidden p-6 sm:p-7 space-y-5">
              
              {/* Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0] dark:border-[#23252E]">
                <div className="flex items-center space-x-2">
                  <img src={aiBot} alt="AI Assistant" className="w-6 h-6 object-contain" />
                  <span className="font-serif font-bold text-xs text-[#222] dark:text-[#FAF8F5]">
                    AI Assistant
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>Active</span>
                </div>
              </div>

              {/* User Prompt */}
              <div className="flex justify-end">
                <div className="px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-200 border border-orange-200/60 dark:border-orange-900/40 text-xs font-semibold">
                  Summarize my notes on Graph Algorithms
                </div>
              </div>

              {/* Assistant Response Card */}
              <div className="p-4 rounded-2xl bg-[#FAF8F4] dark:bg-[#1E2028] border border-[#EAE5DA] dark:border-[#2A2C37] space-y-3 text-xs text-[#44423E] dark:text-[#D1CEC7]">
                <p className="font-medium text-[#222] dark:text-[#FAF8F5]">
                  Here&apos;s a summary of your Graph Algorithms notes:
                </p>

                <div>
                  <strong className="block text-[#222] dark:text-[#FAF8F5] mb-1 font-semibold">
                    Key Concepts:
                  </strong>
                  <ul className="space-y-0.5 pl-2 leading-relaxed text-[#555] dark:text-[#AAA]">
                    <li>• Graph representation (adjacency list and matrix)</li>
                    <li>• Traversal algorithms (BFS and DFS)</li>
                    <li>• Shortest path algorithms (Dijkstra&apos;s and Bellman-Ford)</li>
                    <li>• Minimum spanning trees (Prim&apos;s and Kruskal&apos;s)</li>
                  </ul>
                </div>

                <div>
                  <strong className="block text-[#222] dark:text-[#FAF8F5] mb-1 font-semibold">
                    Key Takeaways:
                  </strong>
                  <ul className="space-y-0.5 pl-2 leading-relaxed text-[#555] dark:text-[#AAA]">
                    <li>• Choose the right algorithm based on problem constraints</li>
                    <li>• Dijkstra works for non-negative weights</li>
                    <li>• BFS is useful for unweighted shortest path problems</li>
                  </ul>
                </div>

                {customAnswer && (
                  <div className="pt-2 border-t border-[#E5E0D5] dark:border-[#2B2D38] text-orange-700 dark:text-orange-300">
                    {customAnswer}
                  </div>
                )}
              </div>

              {/* Sources badges */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#98958E] dark:text-[#7A7C85]">
                  Sources Found in Your Workspace
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] dark:bg-[#20222A] border border-[#E5DFD4] dark:border-[#2C2E38] text-[#555] dark:text-[#CCC] flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-blue-500" />
                    <span>Graph Algorithms (DSA Notes)</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] dark:bg-[#20222A] border border-[#E5DFD4] dark:border-[#2C2E38] text-[#555] dark:text-[#CCC] flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-orange-500" />
                    <span>Dijkstra&apos;s Algorithm</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F4] dark:bg-[#20222A] border border-[#E5DFD4] dark:border-[#2C2E38] text-[#555] dark:text-[#CCC] flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-emerald-500" />
                    <span>Minimum Spanning Tree</span>
                  </span>
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAsk} className="relative flex items-center pt-2">
                <input
                  type="text"
                  placeholder="Ask anything about your notes..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF8F4] dark:bg-[#1E2028] border border-[#E0DAD0] dark:border-[#2D2F3B] rounded-xl text-xs placeholder:text-[#9A9893] text-[#222] dark:text-[#EEE] focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 p-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
