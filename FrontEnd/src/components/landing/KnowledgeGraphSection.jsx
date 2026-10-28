import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Maximize2,
  Share2,
  ZoomIn,
  ZoomOut,
  Info
} from 'lucide-react';

export const KnowledgeGraphSection = () => {
  const [activeNode, setActiveNode] = useState('Graph Algorithms');

  const nodes = [
    {
      id: 'Graph Algorithms',
      label: 'Graph Algorithms',
      category: 'Core',
      cx: 260,
      cy: 210,
      r: 34,
      color: '#EA580C',
      bgColor: 'rgba(234, 88, 12, 0.25)',
      borderColor: '#FB923C',
      notesCount: 14
    },
    {
      id: 'Priority Queue',
      label: 'Priority Queue',
      category: 'Data Structure',
      cx: 260,
      cy: 65,
      r: 22,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: '#34D399',
      notesCount: 6
    },
    {
      id: 'Shortest Path',
      label: 'Shortest Path',
      category: 'Concept',
      cx: 410,
      cy: 130,
      r: 24,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.2)',
      borderColor: '#A78BFA',
      notesCount: 9
    },
    {
      id: 'Dynamic Programming',
      label: 'Dynamic Programming',
      category: 'Paradigm',
      cx: 420,
      cy: 290,
      r: 23,
      color: '#EC4899',
      bgColor: 'rgba(236, 72, 153, 0.2)',
      borderColor: '#F472B6',
      notesCount: 18
    },
    {
      id: 'Greedy Algorithms',
      label: 'Greedy Algorithms',
      category: 'Paradigm',
      cx: 260,
      cy: 355,
      r: 22,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.2)',
      borderColor: '#FBBF24',
      notesCount: 8
    },
    {
      id: 'Trees',
      label: 'Trees',
      category: 'Structure',
      cx: 110,
      cy: 290,
      r: 22,
      color: '#06B6D4',
      bgColor: 'rgba(6, 182, 212, 0.2)',
      borderColor: '#22D3EE',
      notesCount: 11
    },
    {
      id: 'Graphs',
      label: 'Graphs',
      category: 'Theory',
      cx: 110,
      cy: 130,
      r: 24,
      color: '#6366F1',
      bgColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: '#818CF8',
      notesCount: 15
    }
  ];

  const edges = [
    { from: 'Graph Algorithms', to: 'Priority Queue' },
    { from: 'Graph Algorithms', to: 'Shortest Path' },
    { from: 'Graph Algorithms', to: 'Dynamic Programming' },
    { from: 'Graph Algorithms', to: 'Greedy Algorithms' },
    { from: 'Graph Algorithms', to: 'Trees' },
    { from: 'Graph Algorithms', to: 'Graphs' },
    { from: 'Shortest Path', to: 'Priority Queue' },
    { from: 'Graphs', to: 'Trees' },
    { from: 'Dynamic Programming', to: 'Greedy Algorithms' }
  ];

  const getNode = (id) => nodes.find((n) => n.id === id);

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left: Interactive Knowledge Graph Mockup */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl bg-[#121318] border border-[#262833] shadow-2xl p-4 sm:p-6 overflow-hidden">
            
            {/* Window controls */}
            <div className="flex items-center justify-between pb-3 border-b border-[#22242F] text-xs text-[#8E92A0]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px] text-[#A6ABB8]">
                  Graph View &bull; 7 nodes &bull; 9 links
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-1.5 rounded-lg bg-[#1B1D26] hover:bg-[#252834] text-[#A6ABB8] hover:text-white transition-colors"
                  title="Expand"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full h-[380px] sm:h-[420px] flex items-center justify-center">
              <svg
                viewBox="0 0 520 420"
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }}
              >
                {/* Background grid dots */}
                <defs>
                  <pattern id="graph-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#252836" />
                  </pattern>
                </defs>
                <rect width="520" height="420" fill="url(#graph-dots)" opacity="0.6" />

                {/* Edges */}
                {edges.map((edge, idx) => {
                  const source = getNode(edge.from);
                  const target = getNode(edge.to);
                  const isHighlighted =
                    activeNode === edge.from || activeNode === edge.to;
                  return (
                    <line
                      key={idx}
                      x1={source.cx}
                      y1={source.cy}
                      x2={target.cx}
                      y2={target.cy}
                      stroke={isHighlighted ? '#FB923C' : '#333748'}
                      strokeWidth={isHighlighted ? '2' : '1.2'}
                      strokeDasharray={isHighlighted ? 'none' : '4 3'}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const isCenter = node.id === 'Graph Algorithms';
                  const isSelected = activeNode === node.id;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setActiveNode(node.id)}
                      className="cursor-pointer transition-transform duration-200"
                    >
                      {/* Halo ring on hover/selected */}
                      {isSelected && (
                        <circle
                          cx={node.cx}
                          cy={node.cy}
                          r={node.r + 8}
                          fill="none"
                          stroke={node.borderColor}
                          strokeWidth="2"
                          opacity="0.6"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main node bubble */}
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r}
                        fill={node.bgColor}
                        stroke={node.borderColor}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                      />

                      {/* Inner dot */}
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r={isCenter ? 14 : 7}
                        fill={node.color}
                        opacity="0.9"
                      />

                      {/* Node Label */}
                      <text
                        x={node.cx}
                        y={node.cy + node.r + 15}
                        textAnchor="middle"
                        fill={isSelected ? '#FAF8F5' : '#A6ABB8'}
                        fontSize={isCenter ? '11' : '10'}
                        fontWeight={isCenter || isSelected ? '700' : '500'}
                        fontFamily="sans-serif"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Selected Node Inspector floating box */}
              <div className="absolute bottom-3 left-3 bg-[#1A1C24]/90 backdrop-blur-md border border-[#2D303E] rounded-xl px-3 py-2 text-xs flex items-center space-x-2 text-[#DDD]">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getNode(activeNode)?.color || '#EA580C' }}
                />
                <span className="font-semibold text-white">{activeNode}</span>
                <span className="text-[10px] text-[#8E92A0]">
                  &bull; {getNode(activeNode)?.notesCount || 10} linked notes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Text & Bullet Points */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100/70 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>SEE THE BIGGER PICTURE</span>
          </div>

          <h3 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#1E1E1E] dark:text-[#FAF8F5] leading-tight">
            Visualize your knowledge
          </h3>

          <p className="text-sm text-[#6E6C66] dark:text-[#A8A59E] leading-relaxed">
            Discover how your ideas are connected. The knowledge graph helps you see relationships between notes, topics and concepts, so you can build a truly interconnected second brain.
          </p>

          <div className="space-y-3 pt-1">
            {[
              'Automatic links between related notes',
              'Interactive visual graph',
              'Find knowledge gaps',
              'Explore connections across topics'
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
              <span>See how everything connects!</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
