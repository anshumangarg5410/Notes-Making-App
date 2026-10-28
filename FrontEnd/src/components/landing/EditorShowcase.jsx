import React from 'react';
import {
  CheckCircle2,
  Bookmark,
  Lightbulb,
  Code2,
  FileText,
  Save,
  CheckSquare
} from 'lucide-react';

export const EditorShowcase = () => {
  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left: Interactive Note Canvas Preview */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-[#E7E3D8] dark:border-[#2C2E38] bg-white dark:bg-[#181A20] shadow-xl overflow-hidden p-6 sm:p-8 space-y-5">
            {/* Toolbar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0] dark:border-[#242630] text-xs text-[#88857E] dark:text-[#7A7C85]">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-mono text-[11px]">DSA Notes &gt; Graph Algorithms</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Autosaved</span>
                </span>
                <button className="px-2.5 py-1 rounded-lg bg-orange-600 text-white font-medium text-[11px] flex items-center space-x-1">
                  <Save className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Note Content */}
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1E1E1E] dark:text-[#FAF8F5]">
                Dijkstra&apos;s Algorithm
              </h2>

              <p className="text-xs sm:text-sm text-[#66645E] dark:text-[#A8A59E] leading-relaxed">
                Dijkstra&apos;s algorithm is a single-source shortest path algorithm for graphs with non-negative edge weights.
              </p>

              {/* Key Idea Callout Box */}
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 flex items-start space-x-3">
                <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  <strong className="block font-semibold">Key Idea</strong>
                  Always choose the unvisited node with the smallest distance from the source.
                </div>
              </div>

              {/* Numbered Algorithm Steps */}
              <div className="space-y-1.5 text-xs text-[#55534E] dark:text-[#C5C2BA]">
                <strong className="text-xs font-semibold text-[#222] dark:text-[#FAF8F5] block mb-2">
                  Algorithm Steps
                </strong>
                <div className="space-y-1 pl-1">
                  <div className="flex items-start space-x-2">
                    <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">1.</span>
                    <span>Initialize distances array with infinity</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">2.</span>
                    <span>Set source distance to 0</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">3.</span>
                    <span>Use a priority queue to pick the minimum distance node</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">4.</span>
                    <span>Relax all adjacent edges</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">5.</span>
                    <span>Repeat until all nodes are visited</span>
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="rounded-2xl bg-[#18191E] text-[#E0E2EC] p-4 font-mono text-xs overflow-x-auto border border-[#2B2D38]">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2B2D38] text-[10px] text-[#7A7C85]">
                  <span>JavaScript</span>
                  <span>O((V + E) log V)</span>
                </div>
                <pre className="leading-relaxed">
                  <span className="text-purple-400">function</span> <span className="text-blue-400">dijkstra</span>(graph, source) &#123;{'\n'}
                  {'  '}<span className="text-purple-400">const</span> dist = <span className="text-purple-400">new</span> <span className="text-yellow-400">Array</span>(graph.length).<span className="text-blue-400">fill</span>(Infinity);{'\n'}
                  {'  '}dist[source] = <span className="text-orange-400">0</span>;{'\n'}
                  {'  '}<span className="text-purple-400">const</span> pq = <span className="text-purple-400">new</span> <span className="text-yellow-400">PriorityQueue</span>();{'\n'}
                  {'  '}pq.<span className="text-blue-400">push</span>(&#123; id: source, dist: <span className="text-orange-400">0</span> &#125;);{'\n'}
                  &#125;
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Explanatory Copy & Doodles */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/70 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
            <span>WRITE BETTER</span>
          </div>

          <h3 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1E1E1E] dark:text-[#FAF8F5] leading-tight">
            A powerful editor for deeper thinking
          </h3>

          <p className="text-sm text-[#6E6C66] dark:text-[#A8A59E] leading-relaxed">
            Write, plan, and organize your ideas with a beautiful block-based editor. Add code, tables, images, callouts and more — all in a clean, distraction-free space.
          </p>

          <div className="space-y-3 pt-1">
            {[
              'Rich text, code blocks, tables and more',
              'Slash commands and drag-and-drop blocks',
              'Pre-built templates for study, work and personal use',
              'Autosave with version history'
            ].map((text, i) => (
              <div key={i} className="flex items-center space-x-3 text-xs sm:text-sm text-[#44423E] dark:text-[#D1CEC7]">
                <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Handwritten Annotation */}
          <div className="pt-2 pl-6">
            <span className="font-serif italic text-sm text-orange-600 dark:text-orange-400 flex items-center space-x-2">
              <span>⤷</span>
              <span>Write your ideas your way!</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
